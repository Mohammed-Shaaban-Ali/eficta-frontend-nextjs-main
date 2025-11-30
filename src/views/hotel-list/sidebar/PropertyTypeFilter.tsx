'use client';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';

type PropertyType = {
  id: string;
  text: string;
  count: string;
};

type Props = {
  propertyTypes: PropertyType[];
};

const PropertyTypeFilter = (props: Props) => {
  const { propertyTypes } = props;
  const { selectedPropertyTypes, togglePropertyType } = useHotelFilterRedux();

  return (
    <div className="d-flex flex-column gap-2">
      {propertyTypes?.map((propertyType) => {
        const isSelected = selectedPropertyTypes.includes(propertyType.id);
        return (
          <label
            key={propertyType.id}
            className="form-checkbox d-flex items-center justify-between cursor-pointer"
          >
            <div className="d-flex items-center">
              <input
                type="checkbox"
                name={propertyType.id}
                checked={isSelected}
                onChange={() => togglePropertyType(propertyType.id)}
              />
              <div
                className={`form-checkbox__mark ${isSelected ? 'active' : ''}`}
              >
                <div
                  className={`form-checkbox__icon icon-check ${
                    isSelected ? 'active' : ''
                  }`}
                />
              </div>
              <div className="px-10">{propertyType.text}</div>
            </div>
            <div className="ml-10">{propertyType.count}</div>
          </label>
        );
      })}
    </div>
  );
};

export default PropertyTypeFilter;
