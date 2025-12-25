import ShoppingOptimizer from './components/ShoppingOptimizer'
import SafetyRouter from './components/SafetyRouter'
import StoreInfo from './components/StoreInfo'
import FeedbackForm from './components/FeedbackForm'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🏪 Shahapur Sahayak</h1>
        <p className="app-subtitle">Your Safety & Economy Guide for Shahapur</p>
      </header>
      
      <main className="app-main">
        <div className="tools-container">
          <div className="tool-section">
            <ShoppingOptimizer />
          </div>
          
          <div className="tool-section">
            <SafetyRouter />
          </div>
          
          <div className="tool-section">
            <StoreInfo />
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Stay safe, shop smart in Shahapur! 🛡️💰</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
          Made with ❤️ for the Shahapur community
        </p>
      </footer>
      
      <FeedbackForm />
    </div>
  )
}

export default App
