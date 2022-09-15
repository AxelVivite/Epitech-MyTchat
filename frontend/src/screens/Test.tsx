import { useNavigate } from "react-router-dom";


const Test: React.FC = () => {
    let navigate = useNavigate();
    return (
        <div className="Test">
            <text>Test de navigation</text>
            <button onClick={() => navigate("/test")}>Navigue içi</button>
        
        </div>
    );
};

export default Test;