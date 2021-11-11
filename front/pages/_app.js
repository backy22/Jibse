import '../styles/globals.scss'
import AuthWrapper from '../components/auth-wrapper';

function MyApp({ Component, pageProps }) {
  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>    
  )
}

export default MyApp
