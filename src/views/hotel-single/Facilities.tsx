interface Facility {
  facility: string;
  facilityIcon?: string; // Add icon URL support
  facilityType: string;
}

const Facilities = ({ amenities }: { amenities: Facility[] }) => {
  const facilitiesContent = [
    {
      id: 1,
      items: [
        {
          id: 1,
          icon: 'icon-bathtub',
          title: 'Bathroom',
          facilities: amenities?.filter(
            (item) =>
              item.facilityType === 'RoomFacility' &&
              [
                'bathroom',
                'bath',
                'shower',
                'toilet',
                'towels',
                'toiletries',
                'hairdryer',
                'حمام',
                'مرحاض',
                'دش استحمام',
                'حوض استحمام',
                'مناشف',
                'مستلزمات الحمام',
                'مجفف شعر',
              ].some((keyword) =>
                item.facility.toLowerCase().includes(keyword.toLowerCase()),
              ),
          ),
        },
        {
          id: 2,
          icon: 'icon-bed',
          title: 'Bedroom',
          facilities: amenities?.filter(
            (item) =>
              item.facilityType === 'RoomFacility' &&
              [
                'bedroom',
                'bed',
                'wardrobe',
                'closet',
                'linen',
                'سرير',
                'سرير أريكة',
                'سرير أطفال',
              ].some((keyword) =>
                item.facility.toLowerCase().includes(keyword.toLowerCase()),
              ),
          ),
        },
        {
          id: 3,
          icon: 'icon-bell-ring',
          title: 'Reception services',
          facilities: amenities?.filter(
            (item) =>
              item.facilityType === 'HotelFacility' &&
              [
                'check-in',
                'check-out',
                'luggage',
                'front desk',
                'reception',
                'تسجيل وصول',
                'خدمة استقبال',
                'تخزين أمتعة',
                'مكتب استقبال',
              ].some((keyword) =>
                item.facility.toLowerCase().includes(keyword.toLowerCase()),
              ),
          ),
        },
      ],
    },
    {
      id: 2,
      items: [
        {
          id: 1,
          icon: 'icon-tv',
          title: 'Media & Technology',
          facilities: amenities?.filter((item) =>
            [
              'tv',
              'television',
              'satellite',
              'radio',
              'telephone',
              'wifi',
              'internet',
              'تلفزيون',
              'راديو',
              'هاتف',
              'إنترنت',
              'إنترنت لاسلكي',
              'إنترنت مجاني',
            ].some((keyword) =>
              item.facility.toLowerCase().includes(keyword.toLowerCase()),
            ),
          ),
        },
        {
          id: 2,
          icon: 'icon-juice',
          title: 'Food & Drink',
          facilities: amenities?.filter(
            (item) =>
              item.facilityType === 'HotelFacility' &&
              [
                'meal',
                'breakfast',
                'bar',
                'restaurant',
                'coffee',
                'tea',
                'dining',
                'مطعم',
                'قهوة',
                'بار',
                'بوفيه',
                'إفطار',
                'وجبة عشاء',
              ].some((keyword) =>
                item.facility.toLowerCase().includes(keyword.toLowerCase()),
              ),
          ),
        },
        {
          id: 3,
          icon: 'icon-washing-machine',
          title: 'Cleaning services',
          facilities: amenities?.filter(
            (item) =>
              item.facilityType === 'HotelFacility' &&
              [
                'housekeeping',
                'cleaning',
                'laundry',
                'التنظيف',
                'خدمات التنظيف',
                'خدمة غسيل الملابس',
                'خدمة التنظيف الجاف',
              ].some((keyword) =>
                item.facility.toLowerCase().includes(keyword.toLowerCase()),
              ),
          ),
        },
      ],
    },
    {
      id: 3,
      items: [
        {
          id: 1,
          icon: 'icon-shield',
          title: 'Safety & security',
          facilities: amenities?.filter(
            (item) =>
              item.facilityType === 'HotelFacility' &&
              [
                'security',
                'fire',
                'smoke',
                'cctv',
                'safe',
                'حراسة',
                'خزنة',
                'إنذار دخان',
                'ميزات الأمن',
                'إسعافات أولية',
              ].some((keyword) =>
                item.facility.toLowerCase().includes(keyword.toLowerCase()),
              ),
          ),
        },
        {
          id: 2,
          icon: 'icon-city-2',
          title: 'General',
          facilities: amenities?.filter((item) =>
            [
              'heating',
              'air conditioning',
              'fan',
              'iron',
              'disabled',
              'non-smoking',
              'lift',
              'تكييف هواء',
              'مكواة',
              'غرف لغير المدخنين',
              'منطقة تدخين',
              'مصاعد',
            ].some((keyword) =>
              item.facility.toLowerCase().includes(keyword.toLowerCase()),
            ),
          ),
        },
      ],
    },
  ];

  return (
    <>
      {facilitiesContent.map((item) => (
        <div className="col-xl-4" key={item.id}>
          <div className="row y-gap-30">
            {item?.items?.map(
              (facility) =>
                facility?.facilities?.length > 0 && (
                  <div className="col-12" key={facility.id}>
                    <div>
                      <div className="d-flex items-center text-16 fw-500 gap-2" >
                        <i className={`${facility.icon} text-20 mr-10`} />
                        {facility.title}
                      </div>
                      <ul className="text-15 pt-10">
                        {facility?.facilities?.map((val, i) => (
                          <li className="d-flex items-center gap-2" key={i}>
                            {val.facilityIcon ? (
                              <img
                                src={val.facilityIcon}
                                alt={val.facility}
                                className="mr-10 text-muted"
                                width="15"
                                height="15"
                              />
                            ) : (
                              <i className="icon-check text-10 mr-20" />
                            )}
                            {val.facility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Facilities;
