import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  ColorScheme,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import { CornerUpRight, ExternalLink, MapPin } from 'lucide-react';
import {
  SHOWROOM_LANDMARKS,
  SHOWROOM_LOCATION,
  ShowroomLandmark,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsUrl,
} from '../data/storeShowroom';

interface ShowroomGoogleMapProps {
  selectedLandmark: ShowroomLandmark;
  onSelectLandmark: (landmarkId: string) => void;
  hasApiKey: boolean;
}

const MapCameraController: React.FC<{ target: ShowroomLandmark }> = ({ target }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo({ lat: target.lat, lng: target.lng });
    map.setZoom(target.id === 'store' || target.id === 'parking' ? 15 : 14);
  }, [map, target]);

  return null;
};

export const ShowroomGoogleMap: React.FC<ShowroomGoogleMapProps> = ({
  selectedLandmark,
  onSelectLandmark,
  hasApiKey,
}) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [storeMarkerRef, storeMarker] = useAdvancedMarkerRef();

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] bg-[#0B0F17] overflow-hidden">
      {hasApiKey ? (
        <GoogleMap
          className="w-full h-full"
          mapId="DEMO_MAP_ID"
          colorScheme={ColorScheme.DARK}
          defaultCenter={{ lat: SHOWROOM_LOCATION.lat, lng: SHOWROOM_LOCATION.lng }}
          defaultZoom={15}
          gestureHandling="greedy"
          fullscreenControl={true}
          streetViewControl={true}
          zoomControl={false}
          mapTypeControl={false}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <MapCameraController target={selectedLandmark} />

          {/* Flagship Store Marker */}
          <AdvancedMarker
            ref={storeMarkerRef}
            position={{ lat: SHOWROOM_LOCATION.lat, lng: SHOWROOM_LOCATION.lng }}
            title="Yasir Mobile Store — Commercial Area, Phase 6, DHA, Lahore"
            onClick={() => {
              onSelectLandmark('store');
              setInfoWindowOpen((prev) => !prev);
            }}
          >
            <Pin
              background="#EF4444"
              borderColor="#991B1B"
              glyphColor="#FFFFFF"
              scale={1.15}
            />
          </AdvancedMarker>

          {infoWindowOpen && storeMarker && (
            <InfoWindow
              anchor={storeMarker}
              onCloseClick={() => setInfoWindowOpen(false)}
              maxWidth={240}
            >
              <div className="text-slate-900 p-1 space-y-1">
                <p className="font-bold text-xs">Yasir Mobile Store</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {SHOWROOM_LOCATION.plotAddress}
                </p>
              </div>
            </InfoWindow>
          )}

          {/* Secondary Selected Landmark Marker */}
          {SHOWROOM_LANDMARKS.filter((lm) => lm.id !== 'store').map((lm) => (
            <AdvancedMarker
              key={lm.id}
              position={{ lat: lm.lat, lng: lm.lng }}
              title={`${lm.name} (${lm.distance})`}
              onClick={() => onSelectLandmark(lm.id)}
            >
              <Pin
                background={lm.id === selectedLandmark.id ? '#3B82F6' : '#1E293B'}
                borderColor={lm.id === selectedLandmark.id ? '#FFFFFF' : '#64748B'}
                glyphColor="#FFFFFF"
                scale={lm.id === selectedLandmark.id ? 1.0 : 0.82}
              />
            </AdvancedMarker>
          ))}
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090C12]">
          <MapPin className="w-8 h-8 text-[#60A5FA] mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-white">Interactive Google Map</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Configure Google Maps API access to view the live dark-mode map of Commercial Area, Phase 6, DHA, Lahore.
          </p>
        </div>
      )}

      {/* Top-Left Floating Dark Location Card matching reference UI */}
      <div className="absolute top-3 left-3 z-10 w-[260px] sm:w-[278px] rounded-2xl bg-[#181B22]/95 backdrop-blur-md border border-white/10 p-3.5 shadow-2xl space-y-3">
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs sm:text-[13px] font-bold text-white leading-tight truncate">
                {SHOWROOM_LOCATION.shortHeading}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {SHOWROOM_LOCATION.parkingNote}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={buildGoogleMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#7AB2FF] hover:bg-[#93C5FD] text-[#090C12] text-xs font-bold transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Open in Maps</span>
          </a>

          <a
            href={buildGoogleMapsDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get driving directions on Google Maps"
            title="Get Directions"
            className="w-9 h-9 rounded-full bg-[#242B38] hover:bg-[#323C4E] border border-white/10 text-[#7AB2FF] flex items-center justify-center shrink-0 transition-colors"
          >
            <span className="w-4 h-4 rotate-45 rounded-[3px] bg-[#7AB2FF] flex items-center justify-center">
              <CornerUpRight className="w-2.5 h-2.5 -rotate-45 text-[#090C12] stroke-[2.75]" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
