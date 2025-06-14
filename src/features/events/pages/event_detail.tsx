"use client"

import { Header } from "@common/components/header"
import { Footer } from "@common/components/footer"
import { Layout } from "@common/components/layout"
import { CommentsSection } from "@common/components/commentsSection"
import { AuthorInfo } from "@events/components/author_info"
import { Calendar, MapPin, Users, UserCheck, UserPlus } from "lucide-react"
import InfoItem from "@events/components/infoitem"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { db } from "@db/client"
import type { Tables } from "@db/schema"
import { useScrollReset } from "@common/hooks/useScrollReset"
import { formatDate, formatDate2 } from "@common/utils"
import { PE_DEPARTMENTS, PE_DISTRICTS } from "@common/data/geo"
import { MarkdownViewer } from "@common/components/md_viewer"
import ContentLoader from "react-content-loader"
import { useState } from "react"

type Props = {
  id: string
}

type Event = Tables<"events"> & {
  author_id: Tables<"profiles">
}

type EventAttendanceSummary = {
  attendees_count: number
  user_is_attending: boolean
}

async function fetchEvent(id: string): Promise<Event | null> {
  const { data, error } = await db.from("events").select("*, author_id(*)").eq("id", id).single()
  if (error) throw new Error(error.message)
  return data
}

async function fetchEventAttendanceSummary(eventId: string): Promise<EventAttendanceSummary> {
  const { data, error } = await db.rpc("get_event_attendance_summary", { event_id: eventId }).single()

  if (error) {
    console.error("Fetch attendance error:", error)
    throw new Error(error.message || "Error al obtener información de asistencia")
  }
  return data
}

async function toggleEventAttendance(eventId: string): Promise<void> {
  const { error } = await db.rpc("toggle_event_attendance", { p_event_id: eventId })

  if (error) {
    console.error("Toggle attendance error:", error)
    throw new Error(error.message || "Error al cambiar estado de asistencia")
  }
}

export function EventDetailBasic({ id }: Props) {
  useScrollReset()
  const queryClient = useQueryClient()
  const [isToggling, setIsToggling] = useState(false)

  const {
    data: event,
    isLoading: eventLoading,
    isError: eventError,
  } = useQuery({
    queryKey: ["event_detail", id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  })

  const { data: attendanceSummary, isLoading: attendanceLoading } = useQuery({
    queryKey: ["event_attendance", id],
    queryFn: () => fetchEventAttendanceSummary(id),
    enabled: !!id,
  })

  const toggleAttendanceMutation = useMutation({
    mutationFn: () => toggleEventAttendance(id),
    onMutate: async () => {
      setIsToggling(true)
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["event_attendance", id] })
      const previousData = queryClient.getQueryData(["event_attendance", id])

      if (previousData && attendanceSummary) {
        const newData = {
          ...attendanceSummary,
          user_is_attending: !attendanceSummary.user_is_attending,
          attendees_count: attendanceSummary.attendees_count
            ? attendanceSummary.user_is_attending
              ? attendanceSummary.attendees_count - 1
              : attendanceSummary.attendees_count + 1
            : attendanceSummary.user_is_attending
              ? 0
              : 1,
        }
        queryClient.setQueryData(["event_attendance", id], newData)
      }

      return { previousData }
    },
    onError: (err, _newData, context) => {
      console.error("Toggle attendance mutation error:", err)
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["event_attendance", id], context.previousData)
      }
      // You might want to show a toast notification here
      alert("Error al cambiar estado de asistencia. Por favor intenta de nuevo.")
    },
    onSuccess: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["event_attendance", id] })
    },
    onSettled: () => {
      setIsToggling(false)
    },
  })

  const handleToggleAttendance = () => {
    if (!isToggling) {
      toggleAttendanceMutation.mutate()
    }
  }

  if (eventLoading) return <Skeleton />

  if (eventError || !event) return <div className="text-center py-10 text-red-600">Error al cargar el evento.</div>

  const isAttending = attendanceSummary?.user_is_attending || false
  const attendeesCount = attendanceSummary?.attendees_count || 0
  const showAttendanceButton = !attendanceLoading

  return (
    <Layout>
      <Header />

      <main className="max-w-4xl mx-auto px-10 py-10">
        <span className="font-semibold text-sm text-primary">{formatDate2(event.event_date)}</span>
        <h1 className="text-3xl font-bold mb-4 mt-1">{event.title}</h1>
        <AuthorInfo author={event.author_id} />

        {event.image_url && (
          <div className="mb-6">
            <img
              src={event.image_url || "/placeholder.svg"}
              alt="Imagen del evento"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* Attendance Section */}
        {showAttendanceButton && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Confirma tu asistencia</h3>
                  <p className="text-sm text-gray-600">
                    {attendeesCount === 0
                      ? "Sé el primero en confirmar"
                      : `${attendeesCount} ${attendeesCount === 1 ? "persona confirmada" : "personas confirmadas"}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleAttendance}
                disabled={isToggling}
                className={`
                  flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-100 min-w-[160px] sm:min-w-[140px]
                  ${
                    isAttending
                      ? "bg-green-600 text-white hover:bg-green-700 border-2 border-green-600"
                      : "bg-primary text-white hover:bg-red-700 border-2 border-primary"
                  }
                  ${isToggling ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${isAttending ? "focus:ring-green-500" : "focus:ring-primary"}
                `}
              >
                {isToggling ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : isAttending ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isToggling ? "Procesando..." : isAttending ? "Confirmado" : "Confirmar"}
                </span>
              </button>
            </div>
          </div>
        )}

        <MarkdownViewer content={event.content} />

        <div className="space-y-4 mb-8">
          <InfoItem title="Día y hora" icon={<Calendar className="w-5 h-5 text-neutral-700" />}>
            {formatDate(event.event_date)}
          </InfoItem>

          <InfoItem title="Localización" icon={<MapPin className="w-5 h-5 text-neutral-700" />}>
            {PE_DEPARTMENTS[event.geo_department].name}, {PE_DISTRICTS[event.geo_district].name}
          </InfoItem>

        </div>

        <CommentsSection handleRefresh={() => {}} event_id={event.id} />
      </main>

      <Footer />
    </Layout>
  )
}

function Skeleton() {
  return (
    <Layout>
      <Header />
      <main className="max-w-4xl mx-auto px-10 py-10">
        <ContentLoader
          speed={2}
          width="100%"
          height={320}
          viewBox="0 0 700 320"
          backgroundColor="#ededed"
          foregroundColor="#ecebeb"
          style={{ width: "100%", height: "auto", maxWidth: 700 }}
        >
          {/* Date */}
          <rect x="0" y="0" rx="4" ry="4" width="120" height="18" />
          {/* Title */}
          <rect x="0" y="30" rx="6" ry="6" width="70%" height="32" />
          {/* Author */}
          <rect x="0" y="75" rx="8" ry="8" width="180" height="20" />
          {/* Image */}
          <rect x="0" y="110" rx="12" ry="12" width="100%" height="120" />
          {/* Content lines */}
          <rect x="0" y="240" rx="4" ry="4" width="90%" height="16" />
          <rect x="0" y="260" rx="4" ry="4" width="80%" height="16" />
          <rect x="0" y="280" rx="4" ry="4" width="60%" height="16" />
        </ContentLoader>
      </main>
      <Footer />
    </Layout>
  )
}
