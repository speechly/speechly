import React, { useState } from 'react';
import './Tabs.css';

interface TabItemProps {
  title: string;
  children?: React.ReactNode;
}

export const TabItem: React.FC<TabItemProps> = ({ children }) => {
  return <>{children}</>;
};

interface TabTitleProps {
  title: string;
  index: number;
  isActive: boolean;
  setActiveTab: (index: number) => void;
}

const TabTitle: React.FC<TabTitleProps> = ({ title, index, isActive, setActiveTab }) => {
  return (
    <button type="button" onClick={() => setActiveTab(index)} className="Tab__title" disabled={isActive}>
      {title}
    </button>
  );
};

interface TabsProps {
  children?: React.ReactElement[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="Tabs">
      <div className="Tabs__nav">
        {children?.map((item, index) => (
          <TabTitle
            key={index}
            index={index}
            title={item.props.title}
            isActive={index === activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>
      <div className="Tabs__content">{children && children[activeTab]}</div>
    </div>
  );
};
