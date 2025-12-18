import '@/styles/booking.css';
import { Link } from '@/i18n/navigation';
import BookingDetails from './sidebar/BookingDetails';
import { bookHotelRequest } from '@/types/requests/bookHotelRequest';
import { UseFormReturn } from 'react-hook-form';
import { FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const CustomerInfo = ({
  form,
  onSubmit,
  isPending,
  members = [],
}: {
  form: UseFormReturn<bookHotelRequest>;
  onSubmit: any;
  isPending: boolean;
  members?: any[];
}) => {
  const t = useTranslations('BookingPage.customer_info');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const [openForms, setOpenForms] = useState<number[]>([0]);
  return (
    <>
      {/* <div className="col-xl-7 col-lg-8 mt-30 select-none ">
        <div className="py-15 px-20 rounded-4 text-15 bg-blue-1-05 shadow-sm border-l-4 border-blue-1">
          {t('sign_in_notice')}
        </div>

        <h2 className="text-22 fw-500 mt-40 md:mt-24">{t('let_us_know')}</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="row x-gap-20 y-gap-20 pt-20"
        >
          {members?.map((member, index) => (
            <React.Fragment key={index}>
              <div
                className="col-12 mt-10 d-flex justify-between items-center cursor-pointer border-light rounded-4 px-20 py-20 transition-all duration-300 hover:bg-blue-1/5"
                onClick={() => {
                  setOpenForms((prev) =>
                    prev.includes(index)
                      ? prev.filter((i) => i !== index)
                      : [...prev, index],
                  );
                }}
              >
                <h3 className="text-18 fw-500">
                  {`${t('passenger')} ${index + 1} - ${t('room')} ${members[index].roomNumber}`}
                  {index === 0 ? ` (${t('lead_passenger')})` : ''}
                  <span className="text-14 text-light-1 mx-10 px-10">
                    ({members[index].type === 0 ? t('adult') : t('child')})
                  </span>
                </h3>
                {openForms.includes(index) ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openForms.includes(index) && (
                <div className="col-12 animate-slideDown">
                  <div className="row x-gap-20 y-gap-20 p-20 bg-white shadow-sm rounded-4 mt-10">
                    <input
                      type="hidden"
                      {...register(`passengers.${index}.Allocation`)}
                      defaultValue={members[index].roomId}
                    />
                    <input
                      type="hidden"
                      {...register(
                        `passengers.${index}.PersonDetails.Type` as any,
                      )}
                      defaultValue={
                        members[index].type
                          ? parseInt(members[index].type) || 0
                          : 0
                      }
                    />
                    <input
                      type="hidden"
                      {...register(
                        `passengers.${index}.PersonDetails.Age` as any,
                      )}
                      defaultValue={
                        members[index].age
                          ? parseInt(members[index].age) || 0
                          : 0
                      }
                    />

                    <div className="col-md-12">
                      <div className="form-input">
                        <select
                          {...register(
                            `passengers[${index}].PersonDetails.Name.NamePrefix` as any,
                            {
                              required: true,
                            },
                          )}
                          style={{
                            minHeight: '70px',
                            paddingTop: '25px',
                          }}
                          className="form-select"
                        >
                          <option value="Mr">{t('mr')}</option>
                          <option value="Mrs">{t('mrs')}</option>
                          <option value="Ms">{t('ms')}</option>
                        </select>
                        <label
                          className="lh-1 text-16 text-light-1"
                          style={{ top: '20px' }}
                        >
                          {t('title')}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-input">
                        <select
                          {...register(`passengers[${index}].Type` as any, {
                            required: true,
                          })}
                          style={{
                            minHeight: '70px',
                            paddingTop: '25px',
                          }}
                          className="form-select"
                          defaultValue={members[index].type}
                        >
                          <option value={0}>Adult</option>
                          <option value={1}>Child</option>
                        </select>
                        <label
                          className="lh-1 text-16 text-light-1"
                          style={{ top: '20px' }}
                        >
                          Passenger Type
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          {...register(
                            `passengers[${index}].PersonDetails.Name.GivenName` as any,
                            { required: true },
                          )}
                        />
                        <label className="lh-1 text-16 text-light-1">
                          {t('first_name')}
                        </label>
                      </div>
                      {errors?.passengers &&
                        errors?.passengers?.[index]?.PersonDetails?.Name
                          ?.GivenName && (
                          <span className="text-red-1">
                            {t('first_name_required')}
                          </span>
                        )}
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          {...register(
                            `passengers[${index}].PersonDetails.Name.Surname` as any,
                            {
                              required: true,
                            },
                          )}
                        />
                        <label className="lh-1 text-16 text-light-1">
                          {t('last_name')}
                        </label>
                      </div>
                      {errors?.passengers &&
                        errors?.passengers?.[index]?.PersonDetails?.Name
                          ?.Surname && (
                          <span className="text-red-1">
                            {t('last_name_required')}
                          </span>
                        )}
                    </div>

                    <div className="col-md-12">
                      <div className="form-input">
                        <input
                          type="email"
                          {...register(
                            `passengers[${index}].Email.Value` as any,
                            {
                              required: true,
                              pattern: /^\S+@\S+$/i,
                            },
                          )}
                        />
                        <label className="lh-1 text-16 text-light-1">
                          {t('email')}
                        </label>
                      </div>
                      {errors?.passengers &&
                        errors?.passengers?.[index]?.Email?.Value && (
                          <span className="text-red-1">
                            {t('email_required')}
                          </span>
                        )}
                    </div>

                    <div className="col-md-12">
                      <div className="form-input">
                        <input
                          type="tel"
                          {...register(
                            `passengers[${index}].Telephone.PhoneNumber` as any,
                            {
                              required: true,
                            },
                          )}
                        />
                        <label className="lh-1 text-16 text-light-1">
                          {t('phone_number')}
                        </label>
                      </div>
                      {errors?.passengers &&
                        errors?.passengers?.[index]?.Telephone?.PhoneNumber && (
                          <span className="text-red-1">
                            {t('phone_number_required')}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          <div className="col-12 mt-20">
            <div className="row y-gap-20 items-center justify-between">
              <div className="col-auto">
                <div className="text-14 text-light-1">
                  {t('terms_agreement')}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              disabled={isPending}
              className="button h-50 px-24 -dark-1 bg-blue-1 text-white d-flex align-items-center gap-10 transition-all duration-300 hover:bg-blue-2"
            >
              {isPending ? (
                <>
                  <FaSpinner
                    className="spinner-border spinner-border-sm me-2"
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                  {t('booking')}
                </>
              ) : (
                t('book_now')
              )}
            </button>
          </div>
        </form>
      </div> */}

      {/* <div className="col-xl-5 col-lg-4 mt-30"> */}
      <div className=" mt-30">
        <div className="booking-sidebar">
          <BookingDetails />
        </div>
      </div>
    </>
  );
};

export default CustomerInfo;
