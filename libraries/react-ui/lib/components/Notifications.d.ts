import React from 'react';
export declare enum NotificationType {
    info = "info",
    warning = "warning"
}
export declare type NotificationItem = {
    type: NotificationType;
    notificationId: string;
    message: string;
    footnote?: string;
    visible: boolean;
};
export declare const Notifications: React.FC;
