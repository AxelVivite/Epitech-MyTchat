import PageLayout from "../layouts/pageLayout/PageLayout";

import Message from "../molecules/Message";

const Test1: React.FC = () => {
    return (
        <div className="Test">
            <PageLayout>
            <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!"/>
            <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!"/>
            <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!"/>
            <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!"/>
            <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!"/>
            </PageLayout>
        </div>
    );
};

export default Test1;