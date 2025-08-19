import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useDeliveryOptions,
  useSelectedDeliveryTime,
  useCheckoutStore,
} from "@/store/checkout";
import { formatNGN } from "@/utils/currency";

const DeliverySchedule: React.FC = () => {
  const deliveryOptions = useDeliveryOptions();
  const selectedDeliveryTime = useSelectedDeliveryTime();
  const { setSelectedTime } = useCheckoutStore();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
            3
          </div>
          <CardTitle className="text-lg">Delivery Schedule</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {deliveryOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedTime(option.id)}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                selectedDeliveryTime === option.id
                  ? "border-secondary bg-transparent"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium text-gray-800">
                {option.label}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {option.description}
              </div>
              <div className="text-xs font-medium text-secondary mt-1">
                {formatNGN(option.price)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliverySchedule;
