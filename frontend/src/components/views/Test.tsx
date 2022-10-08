import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const Test: React.FC = () => {
    const { t } = useTranslation();
    let navigate = useNavigate();

    return (
        <div className="Test">
            <p>{t("nav-test")}</p>
            <button onClick={() => navigate("/test")}>Navigue içi</button>
        </div>
    );
};

export default Test;