import React, { useState, useEffect } from 'react';
import './LiveStatusBar.css';

interface StatusInfo {
  isNightMode: boolean;
  message: string;
  icon: string;
  additionalInfo: string;
}

const LiveStatusBar: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<StatusInfo>({
    isNightMode: false,
    message: '',
    icon: '',
    additionalInfo: ''
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const getLocalStatus = (): StatusInfo => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Convert to minutes for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const nightModeStart = 20 * 60 + 30; // 8:30 PM
    const dayModeStart = 6 * 60; // 6:00 AM
    
    // Night mode: 8:30 PM to 6:00 AM
    const isNightMode = currentTimeInMinutes >= nightModeStart || currentTimeInMinutes < dayModeStart;
    
    if (isNightMode) {
      const hoursUntilMorning = currentTimeInMinutes < dayModeStart 
        ? Math.floor((dayModeStart - currentTimeInMinutes) / 60)
        : Math.floor((24 * 60 + dayModeStart - currentTimeInMinutes) / 60);
      
      return {
        isNightMode: true,
        message: '⚠️ NIGHT MODE: Share Autos are offline. Use private transport for safety.',
        icon: '⚠️',
        additionalInfo: `Share Autos resume in ${hoursUntilMorning}h • Emergency: Call 108 • Private taxis available`
      };
    } else {
      let dayMessage = '✅ DAY MODE: Share Autos running normally.';
      let additionalInfo = '';
      
      if (currentTimeInMinutes >= 14 * 60 && currentTimeInMinutes <= 17 * 60) {
        // 2 PM to 5 PM - best shopping time
        dayMessage += ' D-Mart traffic is low - perfect time to shop!';
        additionalInfo = 'Best shopping window • Short queues • All counters open • Fresh stock available';
      } else if (currentTimeInMinutes >= 7 * 60 && currentTimeInMinutes <= 10 * 60) {
        // 7 AM to 10 AM - morning rush
        dayMessage += ' Morning rush - expect busy D-Mart queues.';
        additionalInfo = 'Peak hours • 15-30min wait expected • Fresh vegetables just arrived • Kirana stores less crowded';
      } else if (currentTimeInMinutes >= 18 * 60 && currentTimeInMinutes <= 21 * 60) {
        // 6 PM to 9 PM - evening rush
        dayMessage += ' Evening rush - D-Mart will be crowded.';
        additionalInfo = 'Heavy traffic • 20-45min queues • Consider Kirana for quick items • Share autos frequent';
      } else if (currentTimeInMinutes >= 12 * 60 && currentTimeInMinutes <= 14 * 60) {
        // Lunch time
        dayMessage += ' Lunch hours - moderate traffic at stores.';
        additionalInfo = 'Moderate crowds • Good time for bulk shopping • Most share autos available';
      } else {
        dayMessage += ' Normal operations - moderate traffic.';
        additionalInfo = 'Regular service • Standard wait times • All transport options available';
      }
      
      return {
        isNightMode: false,
        message: dayMessage,
        icon: '✅',
        additionalInfo
      };
    }
  };

  useEffect(() => {
    // Update status and time immediately
    setCurrentStatus(getLocalStatus());
    setCurrentTime(new Date());
    
    // Update status every 30 seconds for more responsive updates
    const statusInterval = setInterval(() => {
      setCurrentStatus(getLocalStatus());
    }, 30000);
    
    // Update time every second for continuous clock
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Format time with seconds for continuous updates
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`live-status-bar ${currentStatus.isNightMode ? 'night-mode' : 'day-mode'}`}>
      <div className="status-content">
        <div className="status-marquee">
          <span className="status-text">
            {currentStatus.message} • {currentStatus.additionalInfo}
          </span>
        </div>
        <div className="status-indicators">
          <div className="live-indicator">
            <span className="pulse-dot"></span>
            LIVE
          </div>
          <div className="status-time">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatusBar;