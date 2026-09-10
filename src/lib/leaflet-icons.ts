import L from 'leaflet';

export function createScooterIcon(bearing: number = 0) {
  return L.divIcon({
    className: 'leaflet-rider-marker',
    html: `
      <div style="position: relative; width: 48px; height: 48px; display: flex; items-center; justify-content: center;">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background-color: rgba(255, 94, 0, 0.25);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #FF5E00, #E04800);
          border: 3px solid #ffffff;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(${bearing}deg);
          transition: transform 0.3s ease-out;
        ">
          <span style="font-size: 20px; line-height: 1; transform: scaleX(-1);">🛵</span>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
}

export function createRestaurantIcon() {
  return L.divIcon({
    className: 'leaflet-kitchen-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 16px;
        background: #1A1311;
        border: 3px solid #FF5E00;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="font-size: 18px; line-height: 1;">🏪</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
}

export function createDestinationIcon() {
  return L.divIcon({
    className: 'leaflet-destination-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 16px;
        background: #059669;
        border: 3px solid #ffffff;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="font-size: 18px; line-height: 1;">🏠</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
}
