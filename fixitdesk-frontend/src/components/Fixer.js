import { useNavigate } from 'react-router-dom';

const Fixer = () => {
  const navigate = useNavigate();
  function handler() {
    navigate('/');
  }
  return (
    <div>
      <div>MISTA FIXA</div>
      <button onClick={handler}>Back To Home</button>
    </div>
  )
}

export default Fixer
// possible AI endpoint - simple text responder or is it too hard to do? 