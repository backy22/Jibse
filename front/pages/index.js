import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Jibse</title>
        <meta name="description" content="Jibse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="flex justify-between">
        <div>Jibse</div>
        <div>
          <button>Connect</button>
        </div>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Rooms in Toronto
        </h1>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <div>Graph</div>
            <div>Name</div>
          </div>
          <div>
            <div>Graph</div>
            <div>Name</div>
          </div>
          <div>
            <div>Graph</div>
            <div>Name</div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        footer
      </footer>
    </div>
  )
}
