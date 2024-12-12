'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/StateEnum';
import { Button } from 'primereact/button';
import BasicStates from '@components/TableExtensions/BasicStates';
import RolModal from '@components/Modals/RolModal';
//import DeleteModal from '@components/Modals/DeleteModal';
import { InputSwitch } from 'primereact/inputswitch';
//import { remove } from '@api/permissions';
import { Badge } from 'primereact/badge';
import { IRol, IRolResponse } from '@interfaces/IRol';
import { findAll, update } from '@api/roles';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import CustomTypeActions from '@components/TableExtensions/CustomTypeActions';
import { InputText } from 'primereact/inputtext';

const Roles = () => {
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('');
    const [checked, setChecked] = useState(true);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [rol, setRol] = useState<IRol>(null);
    const [data, setData] = useState<IRolResponse>();

    useEffect(() => {
        let debounce = setTimeout(() => {
            getData();
        }, 500);
        return () => {
            clearTimeout(debounce);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const state = checked ? State.ACTIVE : State.INACTIVE;
        const res = await findAll({ page, size, state, searchParam });
        setData(res);
    };

    //Table actions

    const handleCheck = (check: boolean) => {
        setChecked(check);
    };

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleEdit = (data: IRol) => {
        setRol(data);
        setOpenModal(true);
    };

    /*
    const handleModalDelete = (data: IDocType) => {
        setDocumentType(data);
        setOpenModalClose(true);
    };
   */

    const handleDelete = async (rol: IRol) => {
        const state = rol.state === State.ACTIVE ? State.INACTIVE : State.ACTIVE;
        await update(rol._id, {
            state
        });
        getData(data.page);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
            setRol(null);
            getData(page, data?.elementsByPage);
        } else {
            setRol(null);
        }
    };

    return (
        <div className="layout-roles">
            <Toast ref={toast} />
            <RolModal state={openModal} data={rol} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            {/*            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(rol._id)} update={() => handleUpdate()} />
             */}
            <div className="card">
                <div className="w-full flex justify-content-between mb-3">
                    <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2" label="Rol" />

                    <div className="flex">
                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <InputSwitch checked={checked} onChange={(e) => handleCheck(e.value)} />
                    </div>
                </div>
                <DataTable
                    value={data?.data}
                    lazy
                    tableStyle={{ minWidth: '50rem' }}
                    paginator={true}
                    first={tableState?.first ?? 0}
                    rows={data?.elementsByPage}
                    onPage={(e) => handlePagination(e)}
                    totalRecords={data?.elementsByPage * data?.totalPages}
                >
                    <Column field="_id" header="Id" body={(rowData: IRol) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="code" header="Código"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="description" header="Descripción"></Column>
                    <Column field="applyToAccount" body={(rowData: IRol) => <BasicStates state={rowData.applyToAccount} />} header="Cuenta"></Column>
                    <Column field="actions" body={(rowData: IRol) => <CustomTypeActions handleEdit={() => handleEdit(rowData)} data={rowData.state} handleDelete={() => handleDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Roles;
