"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="wrap panel"><h1>Something interrupted your session.</h1><p>Your saved draft may still be available. Try loading this step again.</p><button className="button primary" onClick={reset}>Try again</button></main>;}
