'use client';

import { Tooltip } from 'primereact/tooltip';
import { useContext, useEffect, useRef } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { Breadcrumb, BreadcrumbItem, MenuModal, MenuProps } from '@customTypes/layout';
import { VerifyPermissions } from '@lib/Permissions';
import { useSession } from 'next-auth/react';

const AppSubMenu = (props: MenuProps) => {
    const { layoutState, setBreadcrumbs } = useContext(LayoutContext);
    const tooltipRef = useRef<Tooltip | null>(null);
    const { data: session }: any = useSession(); //data:session

    useEffect(() => {
        if (tooltipRef.current) {
            tooltipRef.current.hide();
            (tooltipRef.current as any).updateTargetEvents();
        }
    }, [layoutState.overlaySubmenuActive]);

    useEffect(() => {
        generateBreadcrumbs(props.model);
    }, []);

    const generateBreadcrumbs = (model: MenuModal[]) => {
        let breadcrumbs: Breadcrumb[] = [];

        const getBreadcrumb = (item: BreadcrumbItem, labels: string[] = []) => {
            const { label, to, items } = item;

            label && labels.push(label);
            items &&
                items.forEach((_item) => {
                    getBreadcrumb(_item, labels.slice());
                });
            to && breadcrumbs.push({ labels, to });
        };

        model.forEach((item) => {
            getBreadcrumb(item);
        });

        setBreadcrumbs(breadcrumbs);
    };
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {props.model.map((item, i) => {
                    return !item.separator && VerifyPermissions(session.access_token, item.permission) ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : '';
                })}
            </ul>
            <Tooltip ref={tooltipRef} target="li:not(.active-menuitem)>.tooltip-target" />
        </MenuProvider>
    );
};

export default AppSubMenu;
