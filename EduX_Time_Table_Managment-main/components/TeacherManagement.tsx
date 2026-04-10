// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Plus, Edit, Trash2, X } from 'lucide-react';

// interface Teacher {
//   _id: string;
//   teacherID: string;
//   faculty_name: string;
//   subject_name: string;
//   department: string;
//   teaching_hours: number;
//   teacher_number: string;
//   classroom: string;
//   assignedHours: number;
//   remainingHours: number;
// }

// export default function TeacherManagement() {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     teacherID: '',
//     faculty_name: '',
//     subject_name: '',
//     department: '',
//     teaching_hours: '',
//     teacher_number: '',
//     classroom: '',
//   });

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   const fetchTeachers = async () => {
//     try {
//       const response = await fetch('/api/teachers');
//       const data = await response.json();
//       setTeachers(data.teachers || []);
//     } catch (error) {
//       console.error('Error fetching teachers:', error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const payload = {
//         ...formData,
//         teaching_hours: parseInt(formData.teaching_hours),
//       };

//       const url = editingTeacher
//         ? `/api/teachers/${editingTeacher._id}`
//         : '/api/teachers';
//       const method = editingTeacher ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || 'Operation failed');
//         setLoading(false);
//         return;
//       }

//       await fetchTeachers();
//       resetForm();
//       setLoading(false);
//     } catch (err: any) {
//       setError(err.message || 'An error occurred');
//       setLoading(false);
//     }
//   };

//   const handleEdit = (teacher: Teacher) => {
//     setEditingTeacher(teacher);
//     setFormData({
//       teacherID: teacher.teacherID,
//       faculty_name: teacher.faculty_name,
//       subject_name: teacher.subject_name,
//       department: teacher.department,
//       teaching_hours: teacher.teaching_hours.toString(),
//       teacher_number: teacher.teacher_number,
//       classroom: teacher.classroom,
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this teacher?')) return;

//     try {
//       const response = await fetch(`/api/teachers/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         alert('Failed to delete teacher');
//         return;
//       }

//       await fetchTeachers();
//     } catch (error) {
//       console.error('Error deleting teacher:', error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       teacherID: '',
//       faculty_name: '',
//       subject_name: '',
//       department: '',
//       teaching_hours: '',
//       teacher_number: '',
//       classroom: '',
//     });
//     setEditingTeacher(null);
//     setShowForm(false);
//     setError('');
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Teacher Management</h2>
//         <Button onClick={() => setShowForm(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Teacher
//         </Button>
//       </div>

//       {showForm && (
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle>
//                 {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
//               </CardTitle>
//               <Button variant="ghost" size="icon" onClick={resetForm}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {error && (
//               <Alert variant="destructive" className="mb-4">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Teacher ID
//                   </label>
//                   <Input
//                     value={formData.teacherID}
//                     onChange={(e) =>
//                       setFormData({ ...formData, teacherID: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Faculty Name
//                   </label>
//                   <Input
//                     value={formData.faculty_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, faculty_name: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Subject Name
//                   </label>
//                   <Input
//                     value={formData.subject_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, subject_name: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Department
//                   </label>
//                   <Input
//                     value={formData.department}
//                     onChange={(e) =>
//                       setFormData({ ...formData, department: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Teaching Hours
//                   </label>
//                   <Input
//                     type="number"
//                     value={formData.teaching_hours}
//                     onChange={(e) =>
//                       setFormData({ ...formData, teaching_hours: e.target.value })
//                     }
//                     required
//                     min="1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Teacher Number
//                   </label>
//                   <Input
//                     value={formData.teacher_number}
//                     onChange={(e) =>
//                       setFormData({ ...formData, teacher_number: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Classroom
//                   </label>
//                   <Input
//                     value={formData.classroom}
//                     onChange={(e) =>
//                       setFormData({ ...formData, classroom: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button type="submit" disabled={loading}>
//                   {loading ? 'Saving...' : editingTeacher ? 'Update' : 'Create'}
//                 </Button>
//                 <Button type="button" variant="outline" onClick={resetForm}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {/* Teachers List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Teachers</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2 text-left">ID</th>
//                   <th className="border p-2 text-left">Name</th>
//                   <th className="border p-2 text-left">Subject</th>
//                   <th className="border p-2 text-left">Department</th>
//                   <th className="border p-2 text-left">Hours</th>
//                   <th className="border p-2 text-left">Assigned</th>
//                   <th className="border p-2 text-left">Remaining</th>
//                   <th className="border p-2 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {teachers.map((teacher) => (
//                   <tr key={teacher._id}>
//                     <td className="border p-2">{teacher.teacherID}</td>
//                     <td className="border p-2">{teacher.faculty_name}</td>
//                     <td className="border p-2">{teacher.subject_name}</td>
//                     <td className="border p-2">{teacher.department}</td>
//                     <td className="border p-2">{teacher.teaching_hours}</td>
//                     <td className="border p-2">{teacher.assignedHours}</td>
//                     <td className="border p-2">
//                       <span
//                         className={
//                           teacher.remainingHours === 0
//                             ? 'text-red-600 font-semibold'
//                             : ''
//                         }
//                       >
//                         {teacher.remainingHours}
//                       </span>
//                     </td>
//                     <td className="border p-2">
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEdit(teacher)}
//                         >
//                           <Edit className="h-3 w-3" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           onClick={() => handleDelete(teacher._id)}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, X, UserCheck, Users, Clock, BookOpen, ChevronRight, Search, AlertCircle } from 'lucide-react';

interface Teacher {
  _id: string;
  teacherID: string;
  faculty_name: string;
  subject_name: string;
  department: string;
  teaching_hours: number;
  teacher_number: string;
  classroom: string;
  assignedHours: number;
  remainingHours: number;
}

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    teacherID: '',
    faculty_name: '',
    subject_name: '',
    department: '',
    teaching_hours: '',
    teacher_number: '',
    classroom: '',
  });

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers');
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData, teaching_hours: parseInt(formData.teaching_hours) };
      const url = editingTeacher ? `/api/teachers/${editingTeacher._id}` : '/api/teachers';
      const method = editingTeacher ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || 'Operation failed'); setLoading(false); return; }
      await fetchTeachers();
      resetForm();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      teacherID: teacher.teacherID,
      faculty_name: teacher.faculty_name,
      subject_name: teacher.subject_name,
      department: teacher.department,
      teaching_hours: teacher.teaching_hours.toString(),
      teacher_number: teacher.teacher_number,
      classroom: teacher.classroom,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    try {
      const response = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      if (!response.ok) { alert('Failed to delete teacher'); return; }
      await fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const resetForm = () => {
    setFormData({ teacherID: '', faculty_name: '', subject_name: '', department: '', teaching_hours: '', teacher_number: '', classroom: '' });
    setEditingTeacher(null);
    setShowForm(false);
    setError('');
  };

  const filtered = teachers.filter(t =>
    t.faculty_name.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.subject_name.toLowerCase().includes(search.toLowerCase()) ||
    t.teacherID.toLowerCase().includes(search.toLowerCase())
  );

  const totalHours = teachers.reduce((s, t) => s + t.teaching_hours, 0);
  const assignedHours = teachers.reduce((s, t) => s + t.assignedHours, 0);
  const fullLoad = teachers.filter(t => t.remainingHours === 0).length;

  const inputCls =
    'w-full px-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-700 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
    'hover:border-blue-300 transition-colors duration-150 placeholder:text-slate-300';

  const cardCls = 'bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden';
  const cardHeaderCls = 'px-6 py-4 border-b border-blue-50 flex items-center gap-3';
  const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4 md:p-8 space-y-6 font-sans">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Faculty</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage faculty details, workloads and assignments</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-md shadow-blue-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Faculty', value: teachers.length, icon: <Users className="w-5 h-5" />, color: 'blue' },
          { label: 'Total Hours', value: totalHours, icon: <Clock className="w-5 h-5" />, color: 'indigo' },
          { label: 'Assigned Hours', value: assignedHours, icon: <BookOpen className="w-5 h-5" />, color: 'sky' },
          { label: 'Full Load', value: fullLoad, icon: <UserCheck className="w-5 h-5" />, color: 'red' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`bg-white rounded-2xl border border-${color}-100 shadow-sm px-5 py-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center text-${color}-600 shrink-0`}>
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className={cardCls}>
          <div className={cardHeaderCls}>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
              <p className="text-xs text-slate-400">Fill in the faculty details below</p>
            </div>
            <button
              onClick={resetForm}
              className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Teacher ID</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. TCH-001"
                    value={formData.teacherID}
                    onChange={(e) => setFormData({ ...formData, teacherID: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Faculty Name</label>
                  <input
                    className={inputCls}
                    placeholder="Full name"
                    value={formData.faculty_name}
                    onChange={(e) => setFormData({ ...formData, faculty_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Subject Name</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Data Structures"
                    value={formData.subject_name}
                    onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Department</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Teaching Hours</label>
                  <input
                    type="number"
                    min="1"
                    className={inputCls}
                    placeholder="e.g. 18"
                    value={formData.teaching_hours}
                    onChange={(e) => setFormData({ ...formData, teaching_hours: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Teacher Number</label>
                  <input
                    className={inputCls}
                    placeholder="Contact number"
                    value={formData.teacher_number}
                    onChange={(e) => setFormData({ ...formData, teacher_number: e.target.value })}
                    required
                  />
                </div>
                <div className="sm:col-span-2 xl:col-span-1">
                  <label className={labelCls}>Classroom</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Room 101"
                    value={formData.classroom}
                    onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white text-sm font-bold transition-all shadow-md shadow-blue-200"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" /> Saving…</>
                  ) : editingTeacher ? 'Update Teacher' : 'Create Teacher'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Teachers Table ── */}
      <div className={cardCls}>
        <div className={cardHeaderCls}>
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">All Faculty</h2>
            <p className="text-xs text-slate-400">{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} registered</p>
          </div>

          {/* Search */}
          <div className="ml-auto relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              className="w-full pl-8 pr-3 py-2 text-sm bg-blue-50 border border-blue-100 rounded-xl placeholder:text-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              placeholder="Search teachers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Users className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">{search ? 'No teachers match your search' : 'No teachers added yet'}</p>
              {!search && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-3 text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2"
                >
                  Add your first teacher
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600">
                  {['ID', 'Name', 'Subject', 'Department', 'Total Hrs', 'Assigned', 'Remaining', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-blue-100 whitespace-nowrap first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((teacher, idx) => {
                  const pct = teacher.teaching_hours > 0
                    ? Math.round((teacher.assignedHours / teacher.teaching_hours) * 100)
                    : 0;
                  const isFull = teacher.remainingHours === 0;
                  return (
                    <tr
                      key={teacher._id}
                      className={`border-t border-blue-50 transition-colors hover:bg-blue-50/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/20'}`}
                    >
                      {/* ID */}
                      <td className="px-4 py-3 pl-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                          {teacher.teacherID}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-slate-800">{teacher.faculty_name}</p>
                          <p className="text-xs text-slate-400">{teacher.teacher_number}</p>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3 text-slate-600">{teacher.subject_name}</td>

                      {/* Department */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                          {teacher.department}
                        </span>
                      </td>

                      {/* Total Hours */}
                      <td className="px-4 py-3 text-slate-700 font-medium">{teacher.teaching_hours}h</td>

                      {/* Assigned with mini bar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700 font-medium w-6">{teacher.assignedHours}</span>
                          <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden w-16">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{pct}%</span>
                        </div>
                      </td>

                      {/* Remaining */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isFull
                            ? 'bg-red-100 text-red-600'
                            : teacher.remainingHours <= 3
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isFull ? '● Full' : `${teacher.remainingHours}h left`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 pr-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher._id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-blue-50 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of {teachers.length} teachers
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}