'use client';

import React, { useState } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabList} role="tablist">
        {items.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {items.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
};
