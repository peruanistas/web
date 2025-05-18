import { useForm } from 'react-hook-form';
import { Button } from '@common/components/button';
import { Link, useLocation } from 'wouter';
import { db } from '@db/client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Inputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const onSubmit = async (data: Inputs) => {
    const { email, password } = data;

    const { error } = await db.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
      setLocation('/');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-[#D9D9D9] rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-[30px] font-bold text-gray-900 mb-1">Iniciar sesión</h2>
          <div className="text-[#757575] text-[14px] text-center w-full">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/signup" className="underline cursor-pointer">
              Regístrate
            </Link>
          </div>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <label className="text-[#404040] mb-2">Correo electrónico</label>
          <input
            type="email"
            placeholder="Email"
            className="border border-[#D9D9D9] rounded-lg p-2 mb-2 w-full text-[#757575]"
            {...register('email', { required: 'Campo requerido' })}
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          <label className="text-[#404040] mb-2 mt-2">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className="border border-[#D9D9D9] rounded-lg p-2 pr-10 w-full text-[#757575]"
              {...register('password', { required: 'Campo requerido' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

          {errorMessage && <p className="text-red-600 text-sm mb-2">{errorMessage}</p>}

          <Button
            variant="red"
            className="font-semibold w-full mt-2"
            type="submit"
            disabled={isSubmitting}
          >
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
};
