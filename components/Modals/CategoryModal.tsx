import React, { useEffect, useRef, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { Toast } from 'primereact/toast';
import { create, update as updateDoc } from '@api/categories';
import { IZodError } from '@interfaces/IAuth';
import { IModalCreate } from '@interfaces/IModal';
import { ValidationFlow } from '@lib/ValidationFlow';
import { showError, showSuccess } from '@lib/ToastMessages';
import { states } from '@lib/data';
import { CategoryValidation } from '@validations/CategoryValidation';
import { HttpStatus } from '@enums/HttpStatusEnum';

export default function CategoryModal({ state, setState, update, data }: IModalCreate) {
    const toast = useRef(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [stateType, setStateType] = useState<any>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        if (data) {
            setName(data.name);
            setDescription(data.description);
            const state = states.filter((s) => s.code === data.state);
            setStateType(state[0]);
        } else {
            setName('');
            setDescription('');
            setStateType('');
        }
    }, [data]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Categoría de variable</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Guardar" onClick={() => handleSubmit()} />
        </div>
    );

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            CategoryValidation({
                name,
                description,
                state: stateType.code
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        var res;
        if (data) {
            res = await updateDoc(data._id, {
                name,
                description,
                state: stateType.code
            });
        } else {
            res = await create({
                name,
                description,
                state: stateType.code
            });
        }

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Categoría creada');
            setTimeout(() => {
                update(!data ? 1 : null);
                handleClose();
            }, 1000);
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte');
        }
    };

    const handleClose = async () => {
        setName('');
        setDescription('');
        setStateType('');
        setValidations([]);
        update(null, false);
        setState(!state);
    };

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <Toast ref={toast} />

            <div className="flex flex-column gap-4">
                <div>
                    <label htmlFor="name">
                        Nombre <span className="text-red-500">*</span>
                    </label>

                    <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                </div>

                <div className="w-full">
                    <label htmlFor="description">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <InputTextarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'description') ? 'p-invalid' : ''} `}
                        placeholder="Descripción"
                        rows={5}
                        cols={30}
                    />
                </div>

                <div>
                    <label htmlFor="type">
                        Estado <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={stateType}
                        onChange={(e: any) => setStateType(e.value)}
                        options={states}
                        id="state"
                        optionLabel="name"
                        placeholder="Estado"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'state') ? 'p-invalid' : ''} `}
                    />{' '}
                </div>
            </div>
        </Dialog>
    );
}
