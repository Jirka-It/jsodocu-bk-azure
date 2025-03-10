import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModal } from '@interfaces/IModal';

import { Toast } from 'primereact/toast';
import { showSuccess } from '@lib/ToastMessages';

export default function ReactImageCropModal({ state, setState }: IModal) {
    const toast = useRef(null);

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Eliminar" onClick={() => handleDelete()} />
        </div>
    );

    const handleDelete = async () => {
        showSuccess(toast, '', 'Registro eliminado.');
        setState(!state);
        //Validate data
    };

    const handleClose = async () => {
        setState(!state);
    };

    return (
        <Dialog
            visible={state}
            modal
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <Toast ref={toast} />
            <p>¿Estás seguro de eliminar este registro?</p>
        </Dialog>
    );
}
