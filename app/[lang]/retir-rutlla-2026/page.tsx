"use client";

import React, { useState, useMemo, useEffect } from 'react';

type Person = {
  id: string;
  nombre: string;
  apellidos: string;
  categoria: string;
  opcional: string[];
  altres: string[];
  detalles: string;
};

const CATEGORIES = [
  { label: 'ADULT/ADULTO +12. COST 100€', value: 100 },
  { label: 'INFANT 0-12. COST 60€', value: 60 }
];

const OPTIONALS = [
  { label: 'LLENÇOLS I TOVALLOLES. COST ADICIONAL DE 4 €/RETIR', value: 4 },
  { label: 'LLENÇOLS. COST ADICIONAL DE 3€/RETIR', value: 3 }
];

const OTHERS = [
  'AL.LERGIES / ALERGIAS',
  'INTOL.LERÀNCIES / INTOL.ERANCIAS',
  'VEGÀ / VEGANO',
  'VEGETARIÀ / VEGETARIANO',
  'CELIAC / CELÍACO'
];

export default function RetirRutlla2026Form() {
  const [people, setPeople] = useState<Person[]>([{
    id: Math.random().toString(36).substring(2, 9),
    nombre: '',
    apellidos: '',
    categoria: '',
    opcional: [],
    altres: [],
    detalles: ''
  }]);

  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [modalidadPago, setModalidadPago] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
      }
    };
    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };
    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const calculateTotal = useMemo(() => {
    return people.reduce((acc, person) => {
      let personTotal = 0;
      const cat = CATEGORIES.find(c => c.label === person.categoria);
      if (cat) personTotal += cat.value;

      person.opcional.forEach(opt => {
        const o = OPTIONALS.find(x => x.label === opt);
        if (o) personTotal += o.value;
      });

      return acc + personTotal;
    }, 0);
  }, [people]);

  const handleAddPerson = () => {
    setPeople([...people, {
      id: Math.random().toString(36).substring(2, 9),
      nombre: '',
      apellidos: '',
      categoria: '',
      opcional: [],
      altres: [],
      detalles: ''
    }]);
  };

  const handleRemovePerson = (id: string) => {
    if (people.length > 1) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const handleChange = (id: string, field: keyof Person, value: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleCheckboxChange = (id: string, field: 'opcional' | 'altres', value: string, checked: boolean) => {
    setPeople(people.map(p => {
      if (p.id === id) {
        if (field === 'opcional') {
          return { ...p, [field]: checked ? [value] : [] };
        }
        const list = p[field] as string[];
        if (checked) {
          return { ...p, [field]: [...list, value] };
        } else {
          return { ...p, [field]: list.filter(item => item !== value) };
        }
      }
      return p;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    if (!email.trim() || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Si us plau, introdueix un correu electrònic vàlid. / Por favor, introduce un correo electrónico válido de contacto.' });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!telefono.trim()) {
      setStatus({ type: 'error', message: 'Si us plau, introdueix un telèfon de contacte. / Por favor, introduce un teléfono de contacto.' });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formaPago) {
      setStatus({ type: 'error', message: 'Si us plau, selecciona una forma de pagament. / Por favor, selecciona una forma de pago.' });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!modalidadPago) {
      setStatus({ type: 'error', message: 'Si us plau, selecciona una modalitat de pagament. / Por favor, selecciona una modalidad de pago.' });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validar que todas las personas tengan nombre, apellidos y categoría
    const isValid = people.every(p => p.nombre.trim() !== '' && p.apellidos.trim() !== '' && p.categoria !== '');
    if (!isValid) {
      setStatus({ type: 'error', message: 'Si us plau, omple els camps obligatoris (Nom, Cognoms i Categoria) per a tots els assistents. / Por favor, rellena los campos obligatorios (Nombre, Apellidos y Categoría) para todos los asistentes.' });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      emailContacto: email.trim(),
      formaPago,
      modalidadPago,
      people: people.map(p => {
        let personTotal = 0;
        const cat = CATEGORIES.find(c => c.label === p.categoria);
        if (cat) personTotal += cat.value;
        p.opcional.forEach(opt => {
          const o = OPTIONALS.find(x => x.label === opt);
          if (o) personTotal += o.value;
        });

        return {
          nombre: p.nombre,
          apellidos: p.apellidos,
          telefono: telefono.trim(),
          categoria: p.categoria,
          opcional: p.opcional,
          altres: p.altres,
          detalles: p.detalles,
          precioPersona: personTotal
        };
      })
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbycqx55pbCOaGnzoWhnDci4idqlbm6VpXiw5uXVkGSOYUQmiQpEpsD7ue-Q58M0K9-o/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // El usuario pidió explícitamente no borrar los datos para que siga viendo el precio final.
      setStatus({ type: 'success', message: 'Inscripció enviada correctament! Revisa el total a pagar a la part inferior. / ¡Inscripción enviada correctamente! Revisa el total a pagar en la parte inferior.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Error a l\'enviar la inscripció. / Error al enviar la inscripción. Por favor, revisa tu conexión e inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-0 sm:py-12 px-0 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 pt-10 sm:pt-0 px-4 sm:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            RETIR RUTLLA 2026
          </h1>
          <p className="text-lg text-slate-600 bg-white inline-block px-6 py-2 rounded-full shadow-sm border border-slate-100">
            Formulari d'inscripció oficial / Formulario de inscripción oficial
          </p>
        </div>

        {status.type && (
          <div className={`mb-8 p-5 mx-4 sm:mx-0 rounded-xl shadow-sm border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <p className="font-medium text-center text-lg">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-32">
          {/* Email y Teléfono de Contacto */}
          <div className="bg-white sm:rounded-2xl shadow-sm sm:shadow-lg overflow-hidden border-y sm:border border-slate-200 sm:border-slate-100 transition-all duration-300 sm:hover:shadow-xl">
            <div className="bg-slate-800 px-4 sm:px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Dades de Contacte / Datos de Contacto
              </h2>
            </div>
            <div className="p-4 sm:p-8">
              <p className="text-sm text-slate-500 mb-6">A aquest correu t'enviarem el resum de la inscripció. Utilitzarem el telèfon en cas d'incidència. / A este correo te enviaremos el resumen de la inscripción con todos los detalles y el importe total que debes abonar. Usaremos el teléfono en caso de incidencia.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">EMAIL DE CONTACTE / EMAIL DE CONTACTO <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-white text-slate-900"
                    placeholder="Ex. correu@exemple.com / Ej. correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">TELÈFON / TELÉFONO <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-white text-slate-900"
                    placeholder="Ex. 600123456 / Ej. 600123456"
                  />
                </div>
              </div>
            </div>
          </div>

          {people.map((person, index) => (
            <div key={person.id} className="bg-white sm:rounded-2xl shadow-sm sm:shadow-lg overflow-hidden border-y sm:border border-slate-200 sm:border-slate-100 transition-all duration-300 sm:hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-inner">
                    {index + 1}
                  </span>
                  Assistent / Asistente
                </h2>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(person.id)}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    title="Eliminar assistent / Eliminar asistente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">NOM / NOMBRE <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={person.nombre}
                      onChange={(e) => handleChange(person.id, 'nombre', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-white text-slate-900"
                      placeholder="Ex. Joan / Ej. Juan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">COGNOM / APELLIDOS <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={person.apellidos}
                      onChange={(e) => handleChange(person.id, 'apellidos', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-white text-slate-900"
                      placeholder="Ex. Pérez / Ej. Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">CATEGORIA PENSIÓ COMPLETA / CATEGORÍA PENSIÓN COMPLETA <span className="text-red-500">*</span></label>
                  <div className="space-y-3">
                    {CATEGORIES.map((cat, i) => (
                      <label key={i} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${person.categoria === cat.label ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                        <input
                          type="radio"
                          name={`categoria-${person.id}`}
                          value={cat.label}
                          checked={person.categoria === cat.label}
                          onChange={(e) => handleChange(person.id, 'categoria', e.target.value)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          required
                        />
                        <span className="ml-4 text-slate-800 font-medium">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">OPCIONAL (Només una opció / Solo una opción)</label>
                  <div className="space-y-3">
                    {OPTIONALS.map((opt, i) => (
                      <label key={i} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${person.opcional.includes(opt.label) ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                        <input
                          type="checkbox"
                          checked={person.opcional.includes(opt.label)}
                          onChange={(e) => handleCheckboxChange(person.id, 'opcional', opt.label, e.target.checked)}
                          className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-4 text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">ALTRES / OTROS (Múltiple)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {OTHERS.map((other, i) => (
                      <label key={i} className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${person.altres.includes(other) ? 'bg-slate-100 border-slate-400' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                        <input
                          type="checkbox"
                          checked={person.altres.includes(other)}
                          onChange={(e) => handleCheckboxChange(person.id, 'altres', other, e.target.checked)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-slate-700 font-medium">{other}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">EN CAS D'AL·LÈRGIES O INTOLERÀNCIES, QUINES SÓN? / EN CASO DE ALERGIAS O INTOLERANCIAS, ¿CUÁLES SON? (Opcional)</label>
                  <textarea
                    value={person.detalles}
                    onChange={(e) => handleChange(person.id, 'detalles', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-white text-slate-900 resize-none"
                    placeholder="Escriu aquí els detalls... / Escribe aquí los detalles..."
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-8 px-4 sm:px-0">
            <button
              type="button"
              onClick={handleAddPerson}
              className="flex items-center justify-center w-full sm:w-auto px-8 py-4 border-2 border-dashed border-blue-400 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-500 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Afegir una altra persona / Añadir otra persona
            </button>
          </div>

          {/* Información de Pago */}
          <div className="bg-white sm:rounded-2xl shadow-sm sm:shadow-lg overflow-hidden border-y sm:border border-slate-200 sm:border-slate-100 transition-all duration-300 sm:hover:shadow-xl mt-8">
            <div className="bg-slate-800 px-4 sm:px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Informació de Pagament / Información de Pago
              </h2>
            </div>
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">FORMA DE PAGAMENT / FORMA DE PAGO <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'Transferencia', label: 'Transferència / Transferencia' },
                    { value: 'Efectivo', label: 'Efectiu / Efectivo' },
                    { value: 'Tarjeta', label: 'Targeta / Tarjeta' }
                  ].map((fp, i) => (
                    <label key={i} className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formaPago === fp.value ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        name="formaPago"
                        value={fp.value}
                        checked={formaPago === fp.value}
                        onChange={(e) => setFormaPago(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <span className={`font-medium ${formaPago === fp.value ? 'text-blue-700' : 'text-slate-700'}`}>{fp.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">MODALITAT DE PAGAMENT / MODALIDAD DE PAGO <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'Pago directo', label: 'Pagament directe / Pago directo' },
                    { value: '6 plazos', label: '6 terminis / 6 plazos' }
                  ].map((mp, i) => (
                    <label key={i} className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${modalidadPago === mp.value ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        name="modalidadPago"
                        value={mp.value}
                        checked={modalidadPago === mp.value}
                        onChange={(e) => setModalidadPago(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <span className={`font-medium ${modalidadPago === mp.value ? 'text-blue-700' : 'text-slate-700'}`}>{mp.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-6">
                <h3 className="text-blue-800 font-bold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Informació Important / Información Importante
                </h3>
                <p className="text-sm text-blue-900 mb-3">
                  Es podrà pagar el Retir al complet, en fins a 6 pagaments mensuals o en efectiu en un sobre durant l'ofrena. / Se podrá pagar el Retiro en completo, hasta 6 pagos mensuales o en efectivo en un sobre durante la ofrenda.
                </p>
                <ul className="text-sm text-blue-800 space-y-2 list-disc pl-5">
                  <li>Si el pagament és per <strong>transferència</strong>, s'ha de posar de concepte: / Si el pago es por <strong>transferencia</strong>, se tiene que poner de concepto: <span className="font-bold bg-blue-200 px-1.5 py-0.5 rounded">Retir2026</span></li>
                  <li>Si el pagament és en <strong>efectiu</strong>, s'haurà d'indicar al sobre: / Si el pago es en <strong>efectivo</strong>, se tendrá que indicar en el sobre: <span className="font-bold bg-blue-200 px-1.5 py-0.5 rounded">Nom i Cognom / Nombre y Apellido y Retir2026</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10 px-4 sm:px-0">
            <button
              type="submit"
              disabled={isSubmitting || status.type === 'success'}
              className={`w-full sm:w-auto px-12 py-5 text-xl font-bold text-white rounded-2xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 ${isSubmitting || status.type === 'success' ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviant... / Enviando...
                </span>
              ) : status.type === 'success' ? (
                'Inscripció Enviada / Inscripción Enviada'
              ) : (
                'Enviar Inscripció / Enviar Inscripción'
              )}
            </button>
          </div>
        </form>

        {/* Floating Total Price Bar */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] p-4 sm:p-6 z-50 transition-transform duration-300 ${isKeyboardOpen ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 p-3 rounded-xl hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total a pagar</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{calculateTotal}</p>
                  <span className="text-2xl font-bold text-slate-600">€</span>
                </div>
                {modalidadPago === '6 plazos' && calculateTotal > 0 && (
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    (Són 6 terminis de / Son 6 plazos de {(calculateTotal / 6).toFixed(2)}€)
                  </p>
                )}
              </div>
            </div>
            
            {status.type === 'success' && (
              <div className="hidden md:flex items-center text-green-700 font-bold bg-green-100 px-6 py-3 rounded-xl border border-green-200 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completat! / ¡Completado!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
