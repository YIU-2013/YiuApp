import { NavigatorScreenParams } from '@react-navigation/native';
import { Announcement, Event, Faculty } from '../types/models';

// ─── Home Stack ───────────────────────────────────────────────────────────────
export type HomeStackParamList = {
  HomeMain: undefined;
  AnnouncementDetail: { announcement: Announcement };
  EventDetail: { event: Event };
};

// ─── Department Stack ─────────────────────────────────────────────────────────
export type DepartmentStackParamList = {
  DepartmentsMain: undefined;
  DepartmentDetail: { faculty: Faculty };
};

// ─── Root Tab ────────────────────────────────────────────────────────────────
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Campus: undefined;
  Departments: NavigatorScreenParams<DepartmentStackParamList> | undefined;
  Opportunities: undefined;
  Contact: undefined;
};

// Declare global navigation type (React Navigation type augmentation)
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
