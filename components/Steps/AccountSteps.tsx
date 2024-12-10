import { useCallback, useState } from 'react';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import StepInfo from './AccountItems/info/page';
import StepUsers from './AccountItems/users/page';
import StepPayment from './AccountItems/payment/page';
import styles from './AccountSteps.module.css';

export default function AccountSteps() {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [{ label: 'Información' }, { label: 'Usuarios' }, { label: 'Facturación' }];

    const renderContent = useCallback(() => {
        switch (activeIndex) {
            case 0:
                return <StepInfo />;

            case 1:
                return <StepUsers />;

            case 2:
                return <StepPayment />;

            default:
                return null;
        }
    }, [activeIndex]);

    return (
        <Card className={`${styles.card}`}>
            {/*
            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
            {renderContent()}
            */}

            <StepUsers />
        </Card>
    );
}
