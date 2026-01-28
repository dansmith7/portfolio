import { Link } from 'react-router-dom'
import './Admin.css'

export default function AdminDashboard() {
  return (
    <>
      <div className="admin-header">
        <h1>Админка</h1>
      </div>
      <p>Выберите раздел в меню:</p>
      <ul style={{ marginTop: '1rem' }}>
        <li><Link to="/admin/settings">Настройки сайта</Link> — hero, описание, Why us, видео, контакты, логотипы</li>
        <li><Link to="/admin/projects">Проекты</Link> — список проектов, карточки для Work и для главной</li>
      </ul>
    </>
  )
}
