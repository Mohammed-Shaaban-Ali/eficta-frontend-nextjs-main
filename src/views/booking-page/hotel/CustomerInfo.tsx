import '@/styles/booking.css';
import { Link } from '@/i18n/navigation';
import BookingDetails from './sidebar/BookingDetails';
import { bookHotelRequest } from '@/types/requests/bookHotelRequest';
import { UseFormReturn } from 'react-hook-form';
import { FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import DatePicker, { registerLocale } from 'react-datepicker';
import { enUS as en } from 'date-fns/locale';
import { ar } from 'date-fns/locale/ar';
import 'react-datepicker/dist/react-datepicker.css';
import countryDialogs from '../../../../public/data/country_dailogs.json';
import ClientSelect from '@/components/ClientSelect';
import { CurrencySelect } from '@/components/Select2';

// Register locales
registerLocale('ar', ar);
registerLocale('en', en);

const CustomerInfo = ({
  form,
  onSubmit,
  isPending,
  members = [],
  selectedPackage,
}: {
  form: UseFormReturn<bookHotelRequest>;
  onSubmit: any;
  isPending: boolean;
  members?: any[];
  selectedPackage?: any;
}) => {
  const t = useTranslations('BookingPage.customer_info');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const [openGuestForms, setOpenGuestForms] = useState<number[]>([0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="mt-30">
        <div className="py-15 px-20 rounded-4 text-15 bg-blue-1-05 shadow-sm border-l-4 border-blue-1">
          {t('sign_in_notice')}
        </div>

        <h2 className="text-22 fw-500 mt-40 md:mt-24">{t('let_us_know')}</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="row x-gap-20 y-gap-20 pt-20"
        >
          {/* Client Information Section */}
          <div className="col-12 mt-10">
            <h3 className="text-18 fw-500 mb-10">Client Information</h3>
            <div className="row x-gap-20 y-gap-20  bg-white shadow-sm rounded-4">
              {/* Title */}
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    style={{
                      paddingTop: '24px',
                    }}
                    type="text"
                    {...register('title', { required: true })}
                  />
                  <label
                    style={{ top: '20px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    {t('title')}
                  </label>
                </div>
                {errors?.title && (
                  <span className="text-red-1">Title is required</span>
                )}
              </div>

              {/* Client Select */}
              <div className="col-md-6">
                <ClientSelect
                  form={form}
                  name="client"
                  label="Client"
                  required={true}
                />
                {errors?.client && (
                  <span className="text-red-1">Client is required</span>
                )}
              </div>

              {/* Email */}
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    style={{
                      paddingTop: '24px',
                    }}
                    type="email"
                    {...register('email' as any, {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                  />
                  <label
                    style={{ top: '20px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    {t('email')}
                  </label>
                </div>
                {errors?.email && (
                  <span className="text-red-1">{t('email_required')}</span>
                )}
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    style={{
                      paddingTop: '24px',
                    }}
                    type="tel"
                    {...register('phone' as any, { required: true })}
                  />
                  <label
                    style={{ top: '20px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    {t('phone_number')}
                  </label>
                </div>
                {errors?.phone && (
                  <span className="text-red-1">
                    {t('phone_number_required')}
                  </span>
                )}
              </div>

              {/* Adults (hidden input with default value) */}
              <input type="hidden" {...register('adults' as any)} />

              {/* Children (hidden input with default value) */}
              <input type="hidden" {...register('children' as any)} />

              {/* Infants (hidden input with default value 0) */}
              <input type="hidden" {...register('infants' as any)} value={0} />

              {/* Client Type (hidden input with default value 'client') */}
              <input
                type="hidden"
                {...register('client_type' as any)}
                value="client"
              />

              {/* Terms */}
              <div className="col-md-12">
                <div className="form-input">
                  <textarea
                    style={{
                      paddingTop: '24px',
                    }}
                    {...register('terms' as any)}
                    rows={3}
                    className="form-control"
                  />
                  <label
                    style={{ top: '20px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    Terms
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="col-md-12">
                <div className="form-input">
                  <textarea
                    style={{
                      paddingTop: '24px',
                    }}
                    {...register('notes' as any)}
                    rows={3}
                    className="form-control"
                  />
                  <label
                    style={{ top: '20px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    Notes
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Guests Section */}
          <div className="col-12 mt-10">
            <h3 className="text-18 fw-500 mb-10">Guests Information</h3>
            {members?.map((member, index) => (
              <React.Fragment key={index}>
                <div
                  className="col-12 mt-10 d-flex justify-between items-center cursor-pointer border-light rounded-4 px-20 py-20 transition-all duration-300 hover:bg-blue-1/5"
                  onClick={() => {
                    setOpenGuestForms((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index],
                    );
                  }}
                >
                  <h3 className="text-18 fw-500">
                    {`Guest ${index + 1}`}
                    {index === 0 ? ` (Lead Guest)` : ''}
                    <span className="text-14 text-light-1 mx-10 px-10">
                      ({member.type === 0 ? t('adult') : t('child')})
                    </span>
                  </h3>
                  {openGuestForms.includes(index) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
                {openGuestForms.includes(index) && (
                  <div className="col-12 animate-slideDown">
                    <div className="row x-gap-20 y-gap-20 p-2! bg-white shadow-sm rounded-4 mt-10">
                      {/* Guest Name */}
                      <div className="col-md-12">
                        <div className="form-input">
                          <input
                            style={{
                              paddingTop: '24px',
                            }}
                            type="text"
                            {...register(`guests.${index}.name` as any)}
                          />
                          <label
                            style={{ top: '20px' }}
                            className="lh-1 text-16 text-light-1"
                          >
                            Name
                          </label>
                        </div>
                        {errors?.guests?.[index]?.name && (
                          <span className="text-red-1">Name is required</span>
                        )}
                      </div>

                      {/* Guest Type */}
                      <div className="col-md-6">
                        <div className="form-input">
                          <select
                            {...register(`guests.${index}.type` as any)}
                            style={{
                              minHeight: '70px',
                              paddingTop: '25px',
                            }}
                            className="form-select"
                            defaultValue={member.type === 0 ? 'adult' : 'child'}
                            disabled
                          >
                            <option value="adult">{t('adult')}</option>
                            <option value="child">{t('child')}</option>
                          </select>
                          <label
                            className="lh-1 text-16 text-light-1"
                            style={{ top: '20px' }}
                          >
                            Guest Type
                          </label>
                        </div>
                        {errors?.guests?.[index]?.type && (
                          <span className="text-red-1">
                            Guest type is required
                          </span>
                        )}
                      </div>

                      {/* Birth Date */}
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            type="hidden"
                            {...register(`guests.${index}.birth_date` as any)}
                          />
                          <DatePicker
                            selected={
                              watch(`guests.${index}.birth_date` as any)
                                ? new Date(
                                    watch(`guests.${index}.birth_date` as any),
                                  )
                                : null
                            }
                            onChange={(date: Date | null) => {
                              if (date) {
                                const formattedDate = date
                                  .toISOString()
                                  .split('T')[0];
                                setValue(
                                  `guests.${index}.birth_date` as any,
                                  formattedDate,
                                  { shouldValidate: true },
                                );
                              } else {
                                setValue(
                                  `guests.${index}.birth_date` as any,
                                  '',
                                  { shouldValidate: true },
                                );
                              }
                            }}
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}
                            className="custom_input-picker w-100"
                            wrapperClassName="border"
                            autoComplete="off"
                            showPopperArrow={false}
                            popperPlacement={
                              isRTL ? 'bottom-end' : 'bottom-start'
                            }
                            isClearable={true}
                            locale={isRTL ? 'ar' : 'en'}
                            calendarClassName={isRTL ? 'rtl-calendar' : ''}
                          />
                          <label
                            style={{ top: '12px' }}
                            className="lh-1 text-16 text-light-1"
                          >
                            {t('birth_date')}
                          </label>
                        </div>
                        {errors?.guests?.[index]?.birth_date && (
                          <span className="text-red-1">
                            {t('birth_date_required')}
                          </span>
                        )}
                      </div>

                      {/* Passport Number */}
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            style={{
                              paddingTop: '24px',
                            }}
                            type="text"
                            {...register(
                              `guests.${index}.passport_number` as any,
                            )}
                          />
                          <label
                            style={{ top: '20px' }}
                            className="lh-1 text-16 text-light-1"
                          >
                            {t('passport_number')}
                          </label>
                        </div>
                        {errors?.guests?.[index]?.passport_number && (
                          <span className="text-red-1">
                            {t('passport_number_required')}
                          </span>
                        )}
                      </div>

                      {/* Passport Country */}
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            style={{
                              paddingTop: '24px',
                            }}
                            type="text"
                            {...register(
                              `guests.${index}.passport_country` as any,
                            )}
                          />
                          <label
                            style={{ top: '20px' }}
                            className="lh-1 text-16 text-light-1"
                          >
                            Passport Country
                          </label>
                        </div>
                        {errors?.guests?.[index]?.passport_country && (
                          <span className="text-red-1">
                            Passport country is required
                          </span>
                        )}
                      </div>

                      {/* Nationality */}
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            style={{
                              paddingTop: '24px',
                            }}
                            type="text"
                            {...register(`guests.${index}.nationality` as any)}
                          />
                          <label
                            style={{ top: '20px' }}
                            className="lh-1 text-16 text-light-1"
                          >
                            Nationality
                          </label>
                        </div>
                        {errors?.guests?.[index]?.nationality && (
                          <span className="text-red-1">
                            Nationality is required
                          </span>
                        )}
                      </div>

                      {/* Issue Date */}
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            type="hidden"
                            {...register(`guests.${index}.issue_date` as any)}
                          />
                          <DatePicker
                            selected={
                              watch(`guests.${index}.issue_date` as any)
                                ? new Date(
                                    watch(`guests.${index}.issue_date` as any),
                                  )
                                : null
                            }
                            onChange={(date: Date | null) => {
                              if (date) {
                                const formattedDate = date
                                  .toISOString()
                                  .split('T')[0];
                                setValue(
                                  `guests.${index}.issue_date` as any,
                                  formattedDate,
                                  { shouldValidate: true },
                                );
                              } else {
                                setValue(
                                  `guests.${index}.issue_date` as any,
                                  '',
                                  { shouldValidate: true },
                                );
                              }
                            }}
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}
                            className="custom_input-picker w-100"
                            wrapperClassName="border"
                            autoComplete="off"
                            showPopperArrow={false}
                            popperPlacement={
                              isRTL ? 'bottom-end' : 'bottom-start'
                            }
                            isClearable={true}
                            locale={isRTL ? 'ar' : 'en'}
                            calendarClassName={isRTL ? 'rtl-calendar' : ''}
                          />
                          <label
                            style={{ top: '12px' }}
                            className="lh-1 text-16 text-light-1"
                          >
                            Issue Date
                          </label>
                        </div>
                        {errors?.guests?.[index]?.issue_date && (
                          <span className="text-red-1">
                            Issue date is required
                          </span>
                        )}
                      </div>

                      {/* Expiry Date */}
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            type="hidden"
                            {...register(`guests.${index}.expiry_date` as any)}
                          />
                          <DatePicker
                            selected={
                              watch(`guests.${index}.expiry_date` as any)
                                ? new Date(
                                    watch(`guests.${index}.expiry_date` as any),
                                  )
                                : null
                            }
                            onChange={(date: Date | null) => {
                              if (date) {
                                const formattedDate = date
                                  .toISOString()
                                  .split('T')[0];
                                setValue(
                                  `guests.${index}.expiry_date` as any,
                                  formattedDate,
                                  { shouldValidate: true },
                                );
                              } else {
                                setValue(
                                  `guests.${index}.expiry_date` as any,
                                  '',
                                  { shouldValidate: true },
                                );
                              }
                            }}
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            className="custom_input-picker w-100"
                            wrapperClassName="border"
                            autoComplete="off"
                            showPopperArrow={false}
                            popperPlacement={
                              isRTL ? 'bottom-end' : 'bottom-start'
                            }
                            isClearable={true}
                            locale={isRTL ? 'ar' : 'en'}
                            calendarClassName={isRTL ? 'rtl-calendar' : ''}
                          />
                          <label
                            style={{ top: '12px' }}
                            className="lh-1 text-16 text-light-1"
                          >
                            Expiry Date
                          </label>
                        </div>
                        {errors?.guests?.[index]?.expiry_date && (
                          <span className="text-red-1">
                            Expiry date is required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Hotels Section */}
          <div className="col-12 mt-10">
            <h3 className="text-18 fw-500 mb-10">Hotel Information</h3>
            <div className="row x-gap-20 y-gap-20  bg-white shadow-sm rounded-4">
              {/* Check In */}
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="hidden"
                    {...register('hotels.0.checkIn' as any, {
                      required: true,
                    })}
                  />
                  <DatePicker
                    selected={
                      watch('hotels.0.checkIn' as any)
                        ? new Date(watch('hotels.0.checkIn' as any))
                        : null
                    }
                    onChange={() => {}}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    className="custom_input-picker w-100"
                    wrapperClassName="border"
                    autoComplete="off"
                    showPopperArrow={false}
                    popperPlacement={isRTL ? 'bottom-end' : 'bottom-start'}
                    isClearable={false}
                    locale={isRTL ? 'ar' : 'en'}
                    calendarClassName={isRTL ? 'rtl-calendar' : ''}
                    disabled
                    readOnly
                  />
                  <label
                    style={{ top: '12px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    Check In
                  </label>
                </div>
                {errors?.hotels?.[0]?.checkIn && (
                  <span className="text-red-1">Check in date is required</span>
                )}
              </div>

              {/* Check Out */}
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="hidden"
                    {...register('hotels.0.checkOut' as any, {
                      required: true,
                    })}
                  />
                  <DatePicker
                    selected={
                      watch('hotels.0.checkOut' as any)
                        ? new Date(watch('hotels.0.checkOut' as any))
                        : null
                    }
                    onChange={() => {}}
                    dateFormat="yyyy-MM-dd"
                    minDate={
                      watch('hotels.0.checkIn' as any)
                        ? new Date(watch('hotels.0.checkIn' as any))
                        : new Date()
                    }
                    className="custom_input-picker w-100"
                    wrapperClassName="border"
                    autoComplete="off"
                    showPopperArrow={false}
                    popperPlacement={isRTL ? 'bottom-end' : 'bottom-start'}
                    isClearable={false}
                    locale={isRTL ? 'ar' : 'en'}
                    calendarClassName={isRTL ? 'rtl-calendar' : ''}
                    disabled
                    readOnly
                  />
                  <label
                    style={{ top: '12px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    Check Out
                  </label>
                </div>
                {errors?.hotels?.[0]?.checkOut && (
                  <span className="text-red-1">Check out date is required</span>
                )}
              </div>

              {/* Hotel ID (hidden, will be set from selectedPackage) */}
              <input type="hidden" {...register('hotels.0.hotel_id' as any)} />

              {/* Buy Currency ID (fixed to 1) */}
              <input
                type="hidden"
                {...register('hotels.0.buy_currency_id' as any, {
                  required: true,
                })}
                value={1}
              />

              {/* Buy Price (from hotel, will be set from selectedPackage) */}
              <input
                type="hidden"
                {...register('hotels.0.buy_price' as any, { required: true })}
              />

              {/* Sell Currency ID (Select2) */}
              <div className="col-md-6">
                <CurrencySelect
                  form={form}
                  name="hotels.0.sell_currency_id"
                  label="Sell Currency"
                  required={true}
                />
                {errors?.hotels?.[0]?.sell_currency_id && (
                  <span className="text-red-1">Sell currency is required</span>
                )}
              </div>

              {/* Sell Price */}
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    style={{
                      paddingTop: '24px',
                    }}
                    type="number"
                    step="0.01"
                    {...register('hotels.0.sell_price' as any, {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  <label
                    style={{ top: '20px' }}
                    className="lh-1 text-16 text-light-1"
                  >
                    Sell Price
                  </label>
                </div>
                {errors?.hotels?.[0]?.sell_price && (
                  <span className="text-red-1">Sell price is required</span>
                )}
              </div>

              {/* Rooms */}
              {selectedPackage?.rooms?.map((room: any, roomIndex: number) => (
                <React.Fragment key={roomIndex}>
                  <div className="col-12 mt-10">
                    <h4 className="text-16 fw-500">Room {roomIndex + 1}</h4>
                  </div>

                  {/* Room Pax */}
                  <div className="col-md-6">
                    <div className="form-input">
                      <input
                        style={{
                          paddingTop: '24px',
                        }}
                        type="text"
                        {...register(
                          `hotels.0.rooms.${roomIndex}.room_pax` as any,
                          { required: true },
                        )}
                        defaultValue={room.roomClass || ''}
                        disabled
                        readOnly
                      />
                      <label
                        style={{ top: '20px' }}
                        className="lh-1 text-16 text-light-1"
                      >
                        Room Pax
                      </label>
                    </div>
                    {errors?.hotels?.[0]?.rooms?.[roomIndex]?.room_pax && (
                      <span className="text-red-1">Room pax is required</span>
                    )}
                  </div>

                  {/* Room Board */}
                  <div className="col-md-6">
                    <div className="form-input">
                      <input
                        style={{
                          paddingTop: '24px',
                        }}
                        type="text"
                        {...register(
                          `hotels.0.rooms.${roomIndex}.room_board` as any,
                        )}
                        defaultValue={room.roomBasisCode || ''}
                        disabled
                        readOnly
                      />
                      <label
                        style={{ top: '20px' }}
                        className="lh-1 text-16 text-light-1"
                      >
                        Room Board
                      </label>
                    </div>
                  </div>

                  {/* Adult */}
                  <div className="col-md-6">
                    <div className="form-input">
                      <input
                        style={{
                          paddingTop: '24px',
                        }}
                        type="number"
                        min={1}
                        {...register(
                          `hotels.0.rooms.${roomIndex}.adult` as any,
                          { required: true, valueAsNumber: true, min: 1 },
                        )}
                        defaultValue={room.adultsCount || 1}
                        disabled
                        readOnly
                      />
                      <label
                        style={{ top: '20px' }}
                        className="lh-1 text-16 text-light-1"
                      >
                        Adults
                      </label>
                    </div>
                    {errors?.hotels?.[0]?.rooms?.[roomIndex]?.adult && (
                      <span className="text-red-1">Adults is required</span>
                    )}
                  </div>

                  {/* Child */}
                  <div className="col-md-6">
                    <div className="form-input">
                      <input
                        style={{
                          paddingTop: '24px',
                        }}
                        type="number"
                        min={0}
                        {...register(
                          `hotels.0.rooms.${roomIndex}.child` as any,
                          { valueAsNumber: true, min: 0 },
                        )}
                        defaultValue={room.kidsAges?.length || 0}
                        disabled
                        readOnly
                      />
                      <label
                        style={{ top: '20px' }}
                        className="lh-1 text-16 text-light-1"
                      >
                        Children
                      </label>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

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
      </div>

      <div className="mt-30">
        <div className="booking-sidebar">
          <BookingDetails />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
