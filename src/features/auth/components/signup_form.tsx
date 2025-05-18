import { useForm } from "react-hook-form";
import { db } from "@db/client";
import { Button } from "@common/components/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";

type Inputs = {
  email: string;
  password: string;
};

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Inputs>();

  const password = watch("password") || "";

  const [hasTyped, setHasTyped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validation = validatePassword(password);

  const [, navigate] = useLocation();

  const onSubmit = async (data: Inputs) => {
    const { email, password } = data;

    const { error } = await db.auth.signUp({ email, password });

    if (error) {
      console.error(error.message);
    } else {
      console.log("Cuenta creada (verifica tu correo)");
      navigate('/completar-registro');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasTyped) setHasTyped(true);
    register("password").onChange?.(e);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-[#D9D9D9] rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-[30px] font-bold text-gray-900 mb-1">Únete a El Peruanista</h2>
          <p className="text-[#757575] text-[14px] text-center">
            ¡Sé parte de la comunidad más transformadora del Perú!
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <label className="text-[#404040] mb-2">Correo electrónico</label>
          <input
            type="email"
            placeholder="Email"
            className="border border-[#D9D9D9] rounded-lg p-2 mb-4 w-full text-[#757575]"
            {...register("email", { required: 'Campo requerido', })}
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          <label className="text-[#404040] mb-2">Contraseña</label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[] pr-10"
              {...register("password", {
                required: true,
                minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" },
                onChange: handlePasswordChange,
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

          <ul
            className={`text-xs space-y-1 mb-4 transform transition-all duration-300 ease-in-out origin-top ${
              hasTyped ? "opacity-100 max-h-40" : "opacity-0 max-h-0 pointer-events-none"
            }`}
          >
            <PasswordRule passed={validation.length} text="Debe tener al menos 8 caracteres" />
            <PasswordRule passed={validation.hasUpperLowerNumber} text="Mayúsculas, minúsculas y números" />
          </ul>
          <Button type="submit" variant="red" className="font-semibold w-full mb-4" disabled={isSubmitting}>
              Crear cuenta
          </Button>
          <label className="text-[#757575] text-[14px] text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="underline cursor-pointer">
              Inicia sesión
            </Link>
          </label>
        </form>
      </div>
    </div>
  );
};

function validatePassword(password: string) {
  const length = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    length,
    hasUpperLowerNumber: hasUpper && hasLower && hasNumber,
  };
}

function PasswordRule({ passed, text }: { passed: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-2 ${passed ? "text-green-600" : "text-red-500"}`}>
      {passed ? <Check size={16} /> : <X size={16} />}
      <span>{text}</span>
    </li>
  );
}
