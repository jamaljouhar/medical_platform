import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import {
  FiFolder,
  FiUsers,
  FiCalendar,
  FiSearch,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiActivity,
  FiUser,
} from 'react-icons/fi';
import api from '../../services/api';
import './MedicalRecord.css';

interface MedicalRecordItem {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentId?: number | null;
  diagnosis: string;
  medicalHistory?: string | null;
  allergies?: string | null;
  notes?: string | null;
  recordDate: string;
  createdAt?: string;
}

const MedicalRecord: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordItem | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/medical-records');
      const result = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      setRecords(Array.isArray(result) ? result : []);
    } 
    catch (err) {
      console.error(err);
      setError('Impossible de charger les dossiers médicaux.');
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const query = search.toLowerCase().trim();

    return (
      String(record.id).includes(query) ||
      String(record.patientId).includes(query) ||
      String(record.doctorId).includes(query) ||
      (record.patientName ?? '').toLowerCase().includes(query) ||
      (record.doctorName ?? '').toLowerCase().includes(query) ||
      (record.diagnosis ?? '').toLowerCase().includes(query)
    );
  });

  const formatDate = (date?: string) => {
    if (!date) return '—';

    const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);

    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString('fr-FR');
  };

  const showDetails = (record: MedicalRecordItem) => {
    setSelectedRecord(record);
    setDetailsVisible(true);
  };

  const deleteRecord = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer ce dossier médical ?')) {
      return;
    }

    try {
      await api.delete(`/medical-records/${id}`);
      setRecords((previous) => previous.filter((record) => record.id !== id));

      if (selectedRecord?.id === id) {
        setDetailsVisible(false);
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error(err);
      window.alert('La suppression du dossier a échoué.');
    }
  };

  const patientTemplate = (record: MedicalRecordItem) => (
    <div className="mr-patient-cell">
      <div className="mr-avatar">
        <FiUser />
      </div>
      <div className="mr-cell-info">
        <span className="text-info">
          {record.patientName || `Patient #${record.patientId}`}
        </span>
        <span className="mr-secondary-text">Dossier N°{record.id}</span>
      </div>
    </div>
  );

  const doctorTemplate = (record: MedicalRecordItem) => (
    <span className="">
      {record.doctorName || `Médecin #${record.doctorId}`}
    </span>
  );

  const diagnosisTemplate = (record: MedicalRecordItem) => (
    <div className="mr-diagnosis-cell" title={record.diagnosis}>
      <FiActivity className="mr-diagnosis-icon" />
      <span>{record.diagnosis}</span>
    </div>
  );

  const dateTemplate = (record: MedicalRecordItem) => (
    <span className="mr-date-cell">
      <FiCalendar />
      {formatDate(record.recordDate)}
    </span>
  );

  const actionsTemplate = (record: MedicalRecordItem) => (
    <div className="mr-table-actions gap-2">
      <Button
        type="button"
        icon={<FiEye />}
        severity="info"
        aria-label="Consulter le dossier"
        tooltip="Consulter"
        onClick={() => showDetails(record)}
        className="rounded-2 bg-primary"
        style={{
          width: 25,
          height: 25,
        }}
      />
      <Button
        type="button"
        icon={<FiTrash2 />}
        className="rounded-2 bg-danger"
        style={{
          width: 25,
          height: 25,
        }}
        severity="danger"
        aria-label="Supprimer le dossier"
        tooltip="Supprimer"
        onClick={() => void deleteRecord(record.id)}
      />
    </div>
  );

  const stats = [
    {
      label: 'Total des dossiers',
      value: records.length,
      icon: <FiFolder />,
      style: 'blue',
    },
    {
      label: 'Patients concernés',
      value: new Set(records.map((record) => record.patientId)).size,
      icon: <FiUsers />,
      style: 'green',
    },
    {
      label: 'Dossiers ce mois',
      value: records.filter((record) => {
        const date = new Date(`${record.recordDate}T00:00:00`);
        const now = new Date();

        return (
          !Number.isNaN(date.getTime()) &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: <FiCalendar />,
      style: 'orange',
    },
  ];

  return (
    <div className="container">
      <header className="mr-page-header">
        <div>
          <div className="mr-breadcrumb">MEDFLOW / GESTION MÉDICALE</div>
          <h1>Dossiers médicaux</h1>
          <p>Consultez et gérez les dossiers médicaux des patients.</p>
        </div>

        <Button
          label="Actualiser"
          icon={<FiRefreshCw />}
          onClick={() => void fetchRecords()}
          loading={loading}
          className="mr-refresh-button"
        />
      </header>

      <section className="mr-stats-grid">
        {stats.map((stat) => (
          <article className="mr-stat-card" key={stat.label}>
            <div className={`mr-stat-icon ${stat.style}`}>{stat.icon}</div>
            <div>
              <span>{stat.label}</span>
              <strong className='text-info'>{stat.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="mr-content-card">
        <div className="mr-content-header">
          <div>
            <h2 className='text-info'>Liste des dossiers</h2>
            <p>{filteredRecords.length} dossier(s) trouvé(s)</p>
          </div>

          <span className="mr-search">
            <FiSearch />
            <InputText
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un dossier..."
              aria-label="Rechercher un dossier médical"
            />
          </span>
        </div>

        {error && (
          <div className="mr-error">
            <span>{error}</span>
            <Button
              label="Réessayer"
              text
              onClick={() => void fetchRecords()}
            />
          </div>
        )}

        {/* Tableau visible sur ordinateur et tablette large */}
        <div className="mr-desktop-table">
          <DataTable
            value={filteredRecords}
            dataKey="id"
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            stripedRows
            emptyMessage="Aucun dossier médical trouvé."
            responsiveLayout="scroll"
            className="mr-datatable"
          >
            <Column
              header="Patient"
              body={patientTemplate}
              sortable
              sortField="patientName"
              style={{ minWidth: '220px' }}
            />
            <Column
              header="Médecin"
              body={doctorTemplate}
              style={{ minWidth: '160px' }}
            />
            <Column
              header="Diagnostic"
              body={diagnosisTemplate}
              field="diagnosis"
              sortable
              style={{ minWidth: '220px' }}
            />
            <Column
              header="Date"
              body={dateTemplate}
              field="recordDate"
              sortable
              style={{ minWidth: '140px' }}
            />
            <Column
              header="Actions"
              body={actionsTemplate}
              style={{ width: '120px' }}
            />
          </DataTable>
        </div>

        {/* Cartes visibles sur téléphone */}
        <div className="mr-mobile-cards">
          {loading ? (
            <div className="mr-mobile-message">Chargement des dossiers...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="mr-mobile-message">
              Aucun dossier médical trouvé.
            </div>
          ) : (
            filteredRecords.map((record) => (
              <article className="mr-record-card" key={record.id}>
                <div className="mr-card-top">
                  <div className="mr-patient-cell">
                    <div className="mr-avatar">
                      <FiUser />
                    </div>
                    <div className="mr-cell-info">
                      <strong className="text-info">
                        {record.patientName || `Patient #${record.patientId}`}
                      </strong>
                      <span className="mr-secondary-text">
                        Dossier #{record.id}
                      </span>
                    </div>
                  </div>

                  <Tag value="Médical" severity="info" />
                </div>

                <div className="mr-card-diagnosis">
                  <span className="mr-field-label">DIAGNOSTIC</span>
                  <p>{record.diagnosis}</p>
                </div>

                <div className="mr-card-meta">
                  <div>
                    <span className="mr-field-label">MÉDECIN</span>
                    <span>
                      {record.doctorName || `Médecin #${record.doctorId}`}
                    </span>
                  </div>
                  <div>
                    <span className="mr-field-label">DATE</span>
                    <span>{formatDate(record.recordDate)}</span>
                  </div>
                </div>

                <div className="mr-card-actions">
                  <Button
                    label="Détails"
                    icon={<FiEye />}
                    outlined
                    onClick={() => showDetails(record)}
                  />
                  <Button
                    icon={<FiTrash2 />}
                    label="Supprimer"
                    severity="danger"
                    outlined
                    onClick={() => void deleteRecord(record.id)}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <Dialog
        header="Détails du dossier médical"
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        modal
        draggable={false}
        className="mr-details-dialog"
        style={{ width: 'min(620px, 95vw)' }}
        breakpoints={{ '640px': '95vw' }}
      >
        {selectedRecord && (
          <div className="mr-detail-content">
            <div className="mr-detail-summary">
              <div>
                <span className="mr-field-label">PATIENT</span>
                <strong>
                  {selectedRecord.patientName ||
                    `Patient #${selectedRecord.patientId}`}
                </strong>
              </div>
              <div>
                <span className="mr-field-label">MÉDECIN</span>
                <strong>
                  {selectedRecord.doctorName ||
                    `Médecin #${selectedRecord.doctorId}`}
                </strong>
              </div>
              <div>
                <span className="mr-field-label">DATE</span>
                <strong>{formatDate(selectedRecord.recordDate)}</strong>
              </div>
              <div>
                <span className="mr-field-label">RENDEZ-VOUS</span>
                <strong>{selectedRecord.appointmentId ?? 'Non associé'}</strong>
              </div>
            </div>

            {[
              { label: 'Diagnostic', value: selectedRecord.diagnosis },
              {
                label: 'Antécédents médicaux',
                value: selectedRecord.medicalHistory,
              },
              { label: 'Allergies', value: selectedRecord.allergies },
              { label: 'Notes médicales', value: selectedRecord.notes },
            ].map((item) => (
              <section className="mr-detail-section" key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.value || 'Non renseigné'}</p>
              </section>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default MedicalRecord;
