import ViewPrice from '@/components/parts/ViewPrice';
import { useGetHotelCancellationRequestQuery } from '@/reactQuery/hotels.api';
import { packageTypes } from '@/types/app/packageTypes';
import { cancellationPolicyTypes } from '@/types/app/privacyTypes';
import { getError } from '@/utils/getError';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const CancellationPrivacy = ({
  setShowCancellationPolicy,
  selectedPackage,
}: {
  setShowCancellationPolicy: (value: boolean) => void;
  selectedPackage: packageTypes;
}) => {
  const t = useTranslations('HotelSingle.cancellation_modal');
  const params = useParams();
  const uuid = params.uuid as string;
  const { data, isFetching: isLoadingCancellation } =
    useGetHotelCancellationRequestQuery({
      uuid,
      hotelID: (selectedPackage?.hotelId as any) || '',
      packageID: selectedPackage?.packageId || '',
    });

  const { data: cancellationData } = data || {};
  const formatDateString = (dateString: string) => {
    if (!dateString) return '';

    // Handle "/Date(timestamp+0000)/" format
    const timestamp = dateString.match(/\/Date\((\d+)[+-]\d{4}\)\//);
    if (timestamp && timestamp[1]) {
      const date = new Date(parseInt(timestamp[1]));
      return date.toLocaleDateString();
    }

    return dateString;
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={() => setShowCancellationPolicy(false)}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content border-0 shadow-lg"
          style={{ borderRadius: '1rem' }}
        >
          <div className="modal-header bg-info text-white d-flex align-items-center justify-content-between">
            <h5 className="modal-title fw-bold">{t('title')}</h5>
            <button
              type="button"
              className="btn-close btn-close-white m-0"
              onClick={() => setShowCancellationPolicy(false)}
            />
          </div>
          <div className="modal-body p-4">
            {isLoadingCancellation ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">{t('loading')}</p>
              </div>
            ) : (
              <>
                {cancellationData?.bookingRemarks && (
                  <div className="mb-4">
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-bold">{t('details')}</h6>
                      </div>
                      <div className="card-body">
                        <pre
                          className="mb-0 text-wrap"
                          style={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                          }}
                        >
                          {cancellationData.bookingRemarks}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {cancellationData?.cancellationPolicies &&
                  cancellationData.cancellationPolicies.length > 0 && (
                    <div>
                      <h6 className="mb-3 fw-bold">
                        {t('cancellation_policies')}
                      </h6>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>{t('from_date')}</th>
                              <th>{t('to_date')}</th>
                              <th>{t('cancellation_fee')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cancellationData.cancellationPolicies.map(
                              (policy, index) => (
                                <tr key={index}>
                                  <td>{formatDateString(policy.dateFrom)}</td>
                                  <td>{formatDateString(policy.dateTo)}</td>
                                  <td>
                                    <div className="d-flex flex-column">
                                      <ViewPrice
                                        finalPrice={
                                          policy.cancellationFee.finalPrice
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary rounded-pill"
              onClick={() => setShowCancellationPolicy(false)}
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPrivacy;
