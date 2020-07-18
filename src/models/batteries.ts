import { Battery, Affiliate } from '@/types';
import { useState, useEffect } from 'react';
import { saveAffiliate, subscribeBatteries } from '@/services/batteries';

export interface BatteriesModelState {
  batteries: Battery[];
  selectedBattery?: Battery;
  editBattery?: boolean;
  showNewAffiliateModal?: boolean;
}

export default () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<Battery | undefined>(undefined);
  const [editBattery, setEditBattery] = useState<Battery | undefined>(undefined);
  const [showNewAffiliateModal, setShowNewAffiliateModal] = useState(undefined);
  useEffect(() => {
    subscribeBatteries(setBatteries);
  }, []);
  return {
    setSelectedBattery,
    setEditBattery,
    setBatteries,
    setShowNewAffiliateModal,
    addBattery: (battery: Battery) => setBatteries([...batteries, battery]),
    setAffiliate: async (affiliate: Affiliate) => {
      if (!selectedBattery) throw Error('can not set affiliate on undefined battery');

      return saveAffiliate(selectedBattery.id, affiliate);
    },
    batteries,
    selectedBattery,
    editBattery,
    showNewAffiliateModal,
  };
};
