import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import AdminDashboard from '../components/admin/AdminDashboard'
import EventsManager from '../components/admin/EventsManager'
import MenuManager from '../components/admin/MenuManager'
import GalleryManager from '../components/admin/GalleryManager'
import HoursManager from '../components/admin/HoursManager'
import ReviewsManager from '../components/admin/ReviewsManager'
import ReservationsManager from '../components/admin/ReservationsManager'

export default function AdminPage() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="hours" element={<HoursManager />} />
        <Route path="reviews" element={<ReviewsManager />} />
        <Route path="reservations" element={<ReservationsManager />} />
      </Route>
    </Routes>
  )
}
