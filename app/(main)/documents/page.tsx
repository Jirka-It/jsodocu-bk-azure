'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DocumentActions from '@components/TableExtensions/DocumentActions';
import DocumentStates from '@components/TableExtensions/DocumentStates';
import DeleteModal from '@components/Modals/DeleteModal';
import DocumentModal from '@components/Modals/DocumentModal';
import { IDocumentResponse } from '@interfaces/IDocument';

import { useRouter } from 'next/navigation';
import { findAll, remove, update } from '@api/documents';

const Documents = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [id, setId] = useState<string>();
    const [data, setData] = useState<IDocumentResponse>();

    const router = useRouter();

    useEffect(() => {
        getData();
    }, []);

    const getData = async (page: number = 1, size: number = 5) => {
        const res = await findAll({ page, size });
        setData(res);
    };

    //Table actions

    const handleView = (id: string) => {
        router.push(`/documents/${id}`);
    };

    const handleEdit = (id: string) => {
        setOpenModal(true);
    };

    const handleModalDelete = (id: string) => {
        setId(id);
        setOpenModalClose(true);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleDelete = () => {
        const page = tableState ? tableState?.page + 1 : 1;
        getData(page, 5);
    };

    return (
        <div className="layout-permissions">
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Documento" />
            <DocumentModal state={openModal} setState={(e) => setOpenModal(e)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(id)} update={() => handleDelete()} />
            <div className="card">
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
                    <Column field="type.name" header="Tipo"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="createdAt" header="Fecha"></Column>
                    <Column field="version" header="Versión" body={(rowData) => `V. ${rowData.version}`}></Column>
                    <Column field="step" body={(rowData) => <DocumentStates state={rowData.step} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData) => <DocumentActions handleView={() => handleView(rowData._id)} handleEdit={() => handleEdit(rowData._id)} handleDelete={() => handleModalDelete(rowData._id)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
