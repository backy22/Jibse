import AuthWrapper from '../components/auth-wrapper';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>    
  )
}

export default MyApp
