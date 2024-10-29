import { State } from '@enums/ConfigurationEnum';
import { Variable } from '@enums/DocumentEnum';
import { Tag } from 'primereact/tag';
import styles from './BasicStates.module.css';

interface IBasicState {
    state: string;
}

export default function BasicStates({ state }: IBasicState) {
    switch (state) {
        case State.ACTIVE:
            return <Tag className={styles['tag-state']} value="Activo" severity="success"></Tag>;

        case State.INACTIVE:
            return <Tag className={styles['tag-state']} value="Inactivo" severity="danger"></Tag>;

        case Variable.GENERAL:
            return <Tag className={styles['tag-state']} value="General" severity="success"></Tag>;

        case Variable.PROJECT:
            return <Tag className={styles['tag-state']} value="Proyecto" severity="info"></Tag>;

        default:
            return <Tag className={styles['tag-state']} value="Sin estado"></Tag>;
    }
}
