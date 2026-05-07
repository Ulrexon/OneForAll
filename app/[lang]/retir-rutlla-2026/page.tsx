"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import logoImg from './logo.png';
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
  { label: 'INFANT 3-12. COST 60€', value: 60 }
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

      setStatus({ type: 'success', message: 'Inscripció enviada correctament! T\'hem enviat un correu amb tota la informació. Revisa el total a pagar a la part inferior. / ¡Inscripción enviada correctamente! Te hemos enviado un correo con toda la información. Revisa el total a pagar en la parte inferior.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Error a l\'enviar la inscripció. / Error al enviar la inscripción. Por favor, revisa tu conexión e inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryLabel = (label: string) => {
    if (label === 'ADULT/ADULTO +12. COST 100€') {
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm sm:text-base">ADULT <span className="text-slate-500 font-normal text-xs sm:text-sm">/ ADULTO (+12)</span></span>
          <span className="text-sm font-semibold text-blue-600 mt-1">100€</span>
        </div>
      );
    }
    if (label === 'INFANT 3-12. COST 60€') {
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm sm:text-base">INFANT <span className="text-slate-500 font-normal text-xs sm:text-sm">/ INFANTIL (3-12)</span></span>
          <span className="text-sm font-semibold text-blue-600 mt-1">60€</span>
        </div>
      );
    }
    return label;
  };

  const renderOptionalLabel = (label: string) => {
    if (label === 'LLENÇOLS I TOVALLOLES. COST ADICIONAL DE 4 €/RETIR') {
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-sm sm:text-base">Llençols i tovalloles <span className="text-slate-500 font-normal text-xs sm:text-sm">/ Sábanas y toallas</span></span>
          <span className="text-sm font-semibold text-indigo-600 mt-1">+4€ / retir</span>
        </div>
      );
    }
    if (label === 'LLENÇOLS. COST ADICIONAL DE 3€/RETIR') {
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-sm sm:text-base">Llençols <span className="text-slate-500 font-normal text-xs sm:text-sm">/ Sábanas</span></span>
          <span className="text-sm font-semibold text-indigo-600 mt-1">+3€ / retir</span>
        </div>
      );
    }
    return label;
  };

  const renderOtherLabel = (label: string) => {
    const [ca, es] = label.split(' / ');
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-700 text-sm">{ca}</span>
        {es && <span className="text-xs text-slate-500 mt-0.5">{es}</span>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto min-h-screen bg-slate-50 py-0 sm:py-12 px-0 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 pt-12 sm:pt-0 px-4 sm:px-0">
          <div className="flex justify-center mb-6">
            <Image 
              src={logoImg} 
              alt="Logo Retir Rutlla" 
              className="w-32 sm:w-40 h-auto object-contain drop-shadow-md" 
              priority 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            RETIR RUTLLA 2026
          </h1>
          <div className="flex justify-center">
            <div className="text-slate-600 bg-white inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-6 py-3 rounded-2xl sm:rounded-full shadow-sm border border-slate-200">
              <span className="font-semibold text-sm sm:text-base text-slate-800">Formulari d'inscripció oficial</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="text-xs sm:text-base text-slate-500 font-medium">Formulario de inscripción oficial</span>
            </div>
          </div>
        </div>

        {status.type && (
          <div className={`mb-8 p-6 mx-4 sm:mx-0 rounded-2xl shadow-sm border ${status.type === 'success' ? 'bg-green-50/80 border-green-200 text-green-800' : 'bg-red-50/80 border-red-200 text-red-800'} animate-in fade-in slide-in-from-top-4 duration-500`}>
            {status.message.split(' / ').map((msg, i) => (
              <p key={i} className={`text-center ${i === 0 ? 'font-bold text-lg' : 'text-sm mt-1.5 opacity-80'}`}>
                {msg}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-40">
          {/* Email y Teléfono de Contacto */}
          <div className="bg-white sm:rounded-3xl shadow-sm sm:shadow-lg overflow-hidden border-y sm:border border-slate-200 transition-all duration-300">
            <div className="bg-slate-900 px-5 sm:px-8 py-5">
              <h2 className="text-xl font-bold text-white flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Dades de Contacte</span>
                </div>
                <span className="text-sm font-medium text-slate-400 sm:ml-2 sm:before:content-['|'] sm:before:mr-2 mt-1 sm:mt-0 ml-9 sm:ml-0">Datos de Contacto</span>
              </h2>
            </div>
            <div className="p-5 sm:p-8">
              <div className="mb-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-sm text-slate-700 font-semibold mb-1">A aquest correu t'enviarem el resum de la inscripció. Utilitzarem el telèfon en cas d'incidència.</p>
                <p className="text-xs text-slate-500 font-medium">A este correo te enviaremos el resumen de la inscripción con todos los detalles y el importe total que debes abonar. Usaremos el teléfono en caso de incidencia.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">
                    <span className="block text-sm font-bold text-slate-800">EMAIL DE CONTACTE <span className="text-red-500">*</span></span>
                    <span className="block text-xs font-medium text-slate-500 mt-0.5">EMAIL DE CONTACTO</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-900 font-medium"
                    placeholder="correu@exemple.com"
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    <span className="block text-sm font-bold text-slate-800">TELÈFON <span className="text-red-500">*</span></span>
                    <span className="block text-xs font-medium text-slate-500 mt-0.5">TELÉFONO</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-900 font-medium"
                    placeholder="600 12 34 56"
                  />
                </div>
              </div>
            </div>
          </div>

          {people.map((person, index) => (
            <div key={person.id} className="bg-white sm:rounded-3xl shadow-sm sm:shadow-lg overflow-hidden border-y sm:border border-slate-200 transition-all duration-300 relative group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 sm:px-8 py-5 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex flex-col sm:flex-row sm:items-center">
                  <div className="flex items-center">
                    <span className="bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-inner backdrop-blur-sm text-sm">
                      {index + 1}
                    </span>
                    <span>Assistent</span>
                  </div>
                  <span className="text-sm font-medium text-blue-200 sm:ml-2 sm:before:content-['|'] sm:before:mr-2 mt-1 sm:mt-0 ml-11 sm:ml-0">Asistente</span>
                </h2>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(person.id)}
                    className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    title="Eliminar assistent / Eliminar asistente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="p-5 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2">
                      <span className="block text-sm font-bold text-slate-800">NOM <span className="text-red-500">*</span></span>
                      <span className="block text-xs font-medium text-slate-500 mt-0.5">NOMBRE</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={person.nombre}
                      onChange={(e) => handleChange(person.id, 'nombre', e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-900 font-medium"
                      placeholder="Ex. Joan"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">
                      <span className="block text-sm font-bold text-slate-800">COGNOMS <span className="text-red-500">*</span></span>
                      <span className="block text-xs font-medium text-slate-500 mt-0.5">APELLIDOS</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={person.apellidos}
                      onChange={(e) => handleChange(person.id, 'apellidos', e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-900 font-medium"
                      placeholder="Ex. Pérez"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <label className="block mb-5">
                    <span className="block text-base font-bold text-slate-800">CATEGORIA PENSIÓ COMPLETA <span className="text-red-500">*</span></span>
                    <span className="block text-sm font-medium text-slate-500 mt-1">CATEGORÍA PENSIÓN COMPLETA</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CATEGORIES.map((cat, i) => (
                      <label key={i} className={`flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${person.categoria === cat.label ? 'bg-blue-50/80 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}>
                        <div className="flex-shrink-0 mt-0.5">
                          <input
                            type="radio"
                            name={`categoria-${person.id}`}
                            value={cat.label}
                            checked={person.categoria === cat.label}
                            onChange={(e) => handleChange(person.id, 'categoria', e.target.value)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                            required
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          {renderCategoryLabel(cat.label)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <label className="block mb-5">
                    <span className="block text-base font-bold text-slate-800">OPCIONAL</span>
                    <span className="block text-sm font-medium text-slate-500 mt-1">OPCIONAL (Només una opció / Solo una opción)</span>
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {OPTIONALS.map((opt, i) => (
                      <label key={i} className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${person.opcional.includes(opt.label) ? 'bg-indigo-50/80 border-indigo-400 shadow-md ring-1 ring-indigo-400' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={person.opcional.includes(opt.label)}
                            onChange={(e) => handleCheckboxChange(person.id, 'opcional', opt.label, e.target.checked)}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          {renderOptionalLabel(opt.label)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <label className="block mb-5">
                    <span className="block text-base font-bold text-slate-800">ALTRES <span className="text-slate-500 font-medium text-sm ml-1">(Múltiple)</span></span>
                    <span className="block text-sm font-medium text-slate-500 mt-1">OTROS</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {OTHERS.map((other, i) => (
                      <label key={i} className={`flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${person.altres.includes(other) ? 'bg-slate-100 border-slate-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                        <input
                          type="checkbox"
                          checked={person.altres.includes(other)}
                          onChange={(e) => handleCheckboxChange(person.id, 'altres', other, e.target.checked)}
                          className="w-5 h-5 text-slate-800 focus:ring-slate-800 border-slate-300 rounded-md"
                        />
                        <div className="flex-1">
                          {renderOtherLabel(other)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <label className="block mb-4">
                    <span className="block text-sm font-bold text-slate-800">EN CAS D'AL·LÈRGIES O INTOLERÀNCIES, QUINES SÓN?</span>
                    <span className="block text-xs font-medium text-slate-500 mt-1">EN CASO DE ALERGIAS O INTOLERANCIAS, ¿CUÁLES SON? (Opcional)</span>
                  </label>
                  <textarea
                    value={person.detalles}
                    onChange={(e) => handleChange(person.id, 'detalles', e.target.value)}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-900 resize-none font-medium leading-relaxed"
                    placeholder="Escriu aquí els detalls... / Escribe aquí los detalles..."
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-10 px-4 sm:px-0">
            <button
              type="button"
              onClick={handleAddPerson}
              className="group flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto px-8 py-5 border-2 border-dashed border-blue-300 text-blue-700 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-500 rounded-2xl sm:rounded-3xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 sm:mb-0 sm:mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <div className="flex flex-col items-center sm:items-start">
                <span className="font-bold text-base">Afegir una altra persona</span>
                <span className="text-xs font-semibold text-blue-600/80 mt-0.5">Añadir otra persona</span>
              </div>
            </button>
          </div>

          {/* Información de Pago */}
          <div className="bg-white sm:rounded-3xl shadow-sm sm:shadow-lg overflow-hidden border-y sm:border border-slate-200 transition-all duration-300 mt-10">
            <div className="bg-slate-900 px-5 sm:px-8 py-5">
              <h2 className="text-xl font-bold text-white flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Informació de Pagament</span>
                </div>
                <span className="text-sm font-medium text-slate-400 sm:ml-2 sm:before:content-['|'] sm:before:mr-2 mt-1 sm:mt-0 ml-9 sm:ml-0">Información de Pago</span>
              </h2>
            </div>
            
            <div className="p-5 sm:p-8 space-y-10">
              <div>
                <label className="block mb-5 text-center sm:text-left">
                  <span className="block text-base font-bold text-slate-800">FORMA DE PAGAMENT <span className="text-red-500">*</span></span>
                  <span className="block text-sm font-medium text-slate-500 mt-1">FORMA DE PAGO</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'Transferencia', ca: 'Transferència', es: 'Transferencia' },
                    { value: 'Efectivo', ca: 'Efectiu', es: 'Efectivo' },
                    { value: 'Tarjeta', ca: 'Targeta', es: 'Tarjeta' }
                  ].map((fp, i) => (
                    <label key={i} className={`flex items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${formaPago === fp.value ? 'bg-green-50/80 border-green-500 shadow-md ring-1 ring-green-500' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}>
                      <input
                        type="radio"
                        name="formaPago"
                        value={fp.value}
                        checked={formaPago === fp.value}
                        onChange={(e) => setFormaPago(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <div className="flex flex-col items-center text-center">
                        <span className={`font-bold text-lg ${formaPago === fp.value ? 'text-green-700' : 'text-slate-700'}`}>{fp.ca}</span>
                        <span className={`text-xs font-semibold mt-1 ${formaPago === fp.value ? 'text-green-600/80' : 'text-slate-500'}`}>{fp.es}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <label className="block mb-5 text-center sm:text-left">
                  <span className="block text-base font-bold text-slate-800">MODALITAT DE PAGAMENT <span className="text-red-500">*</span></span>
                  <span className="block text-sm font-medium text-slate-500 mt-1">MODALIDAD DE PAGO</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { value: 'Pago directo', ca: 'Pagament directe', es: 'Pago directo' },
                    { value: '6 plazos', ca: '6 terminis (maig a octubre)', es: '6 plazos (mayo a octubre)' }
                  ].map((mp, i) => (
                    <label key={i} className={`flex items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${modalidadPago === mp.value ? 'bg-green-50/80 border-green-500 shadow-md ring-1 ring-green-500' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}>
                      <input
                        type="radio"
                        name="modalidadPago"
                        value={mp.value}
                        checked={modalidadPago === mp.value}
                        onChange={(e) => setModalidadPago(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <div className="flex flex-col items-center text-center">
                        <span className={`font-bold text-lg ${modalidadPago === mp.value ? 'text-green-700' : 'text-slate-700'}`}>{mp.ca}</span>
                        <span className={`text-xs font-semibold mt-1 ${modalidadPago === mp.value ? 'text-green-600/80' : 'text-slate-500'}`}>{mp.es}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-3xl p-6 sm:p-8 mt-10 shadow-sm">
                <h3 className="text-blue-900 font-bold mb-5 flex flex-col sm:flex-row sm:items-center text-lg">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Informació Important</span>
                  </div>
                  <span className="text-sm font-medium text-blue-700/70 sm:ml-2 sm:before:content-['|'] sm:before:mr-2 mt-1 sm:mt-0 ml-8 sm:ml-0">Información Importante</span>
                </h3>
                <div className="text-blue-900 space-y-5">
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                    <p className="font-semibold text-slate-800">Es podrà pagar el Retir al complet, fins a 6 pagaments mensuals (de maig a octubre) o en efectiu en un sobre durant l'ofrena.</p>
                    <p className="text-sm font-medium text-slate-600 mt-1.5">Se podrá pagar el Retiro al completo, en hasta 6 pagos mensuales (de mayo a octubre) o en efectivo en un sobre durante la ofrenda.</p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <p className="font-bold text-slate-800"><span className="text-rose-600">⚠️ Nota sobre els terminis:</span> En cas d'escollir l'opció de 6 terminis (de maig a octubre), si no es paga cada mes s'haurà d'abonar al complet abans de l'octubre.</p>
                      <p className="text-sm font-medium text-slate-600 mt-1.5"><span className="text-rose-500 font-bold">Nota sobre los plazos:</span> En caso de elegir la opción de 6 plazos (de mayo a octubre), si no se paga cada mes se deberá abonar al completo antes de octubre.</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 pl-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2 mr-4 shadow-sm"></div>
                      <div>
                        <p className="font-semibold text-slate-800">Si el pagament és per <span className="text-blue-700">transferència</span>, l'IBAN és <span className="font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800 mx-1 shadow-sm border border-slate-200 select-all">ES49 0049 7594 5928 1001 1582</span> i s'ha de posar de concepte: <span className="font-bold bg-blue-200/80 px-2.5 py-1 rounded-lg text-blue-900 ml-1 shadow-sm border border-blue-200">Retir2026</span></p>
                        <p className="text-sm font-medium text-slate-600 mt-1.5">Si el pago es por <span className="text-blue-600/80">transferencia</span>, el IBAN es <span className="font-mono font-bold bg-slate-100/80 px-2 py-0.5 rounded-md mx-1 text-slate-700 border border-slate-200/80 select-all">ES49 0049 7594 5928 1001 1582</span> y se tiene que poner de concepto: <span className="font-semibold bg-blue-200/50 px-2 py-0.5 rounded-md ml-1 text-blue-900/80 border border-blue-200/50">Retir2026</span></p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2 mr-4 shadow-sm"></div>
                      <div>
                        <p className="font-semibold text-slate-800">Si el pagament és en <span className="text-blue-700">efectiu</span>, s'haurà d'indicar al sobre: <span className="font-bold bg-blue-200/80 px-2.5 py-1 rounded-lg text-blue-900 ml-1 shadow-sm border border-blue-200">Nom i Cognom i Retir2026</span></p>
                        <p className="text-sm font-medium text-slate-600 mt-1.5">Si el pago es en <span className="text-blue-600/80">efectivo</span>, se tendrá que indicar en el sobre: <span className="font-semibold bg-blue-200/50 px-2 py-0.5 rounded-md ml-1 text-blue-900/80 border border-blue-200/50">Nombre y Apellido y Retir2026</span></p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-14 px-4 sm:px-0">
            <button
              type="submit"
              disabled={isSubmitting || status.type === 'success'}
              className={`w-full sm:w-auto px-12 py-6 rounded-3xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 relative overflow-hidden group ${isSubmitting || status.type === 'success' ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black hover:shadow-2xl hover:-translate-y-1'}`}
            >
              <div className="relative z-10 flex flex-col items-center justify-center text-white">
                {isSubmitting ? (
                  <span className="flex items-center justify-center font-bold text-lg">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviant... / Enviando...
                  </span>
                ) : status.type === 'success' ? (
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-xl mb-1 text-green-300">Inscripció Enviada</span>
                    <span className="text-sm font-medium text-green-300/80">Inscripción Enviada</span>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-xl mb-1">Enviar Inscripció</span>
                    <span className="text-sm font-medium text-white/70">Enviar Inscripción</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>

        {/* Floating Total Price Bar */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-15px_30px_-10px_rgba(0,0,0,0.1)] p-4 sm:p-6 z-50 transition-transform duration-500 ease-out ${isKeyboardOpen ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 rounded-2xl hidden sm:block shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total a pagar</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{calculateTotal}</p>
                  <span className="text-2xl font-bold text-slate-600">€</span>
                </div>
                {modalidadPago === '6 plazos' && calculateTotal > 0 && (
                  <p className="text-xs sm:text-sm font-semibold text-indigo-600 mt-1 bg-indigo-50 inline-block px-2.5 py-1 rounded-md">
                    <span className="block sm:inline">6 terminis (maig a octubre) de {(calculateTotal / 6).toFixed(2)}€</span>
                    <span className="hidden sm:inline mx-1.5 text-indigo-300">|</span>
                    <span className="block sm:inline text-indigo-600/70 mt-0.5 sm:mt-0">6 plazos (mayo a octubre) de {(calculateTotal / 6).toFixed(2)}€</span>
                  </p>
                )}
              </div>
            </div>
            
            {status.type === 'success' && (
              <div className="hidden md:flex flex-col items-end text-green-700 bg-green-50 px-6 py-3.5 rounded-2xl border border-green-200 shadow-sm">
                <div className="flex items-center font-bold text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Completat!
                </div>
                <div className="text-xs font-semibold text-green-600/80 mt-1">¡Completado!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
