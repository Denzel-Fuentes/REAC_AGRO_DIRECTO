export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10">
      <section className="mx-auto max-w-5xl rounded-lg border border-green-900/10 bg-white p-8 shadow-xl shadow-green-950/10">
        <p className="text-sm font-bold uppercase tracking-wider text-green-700">AgroDirecto</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-green-950">Bienvenido al panel</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Ya tienes una base organizada para hacer crecer las funciones del marketplace agrícola.
        </p>
      </section>
    </main>
  );
}
