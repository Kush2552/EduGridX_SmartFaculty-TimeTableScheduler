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
//   department: string;
// }

// interface Subject {
//   _id: string;
//   subject_name: string;
//   subject_code: string;
//   teacherId: Teacher | null;
//   requiredPeriods: number;
//   allottedPeriods: number;
//   remainingPeriods: number;
// }

// export default function SubjectManagement() {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     subject_name: '',
//     subject_code: '',
//     teacherId: '',
//     requiredPeriods: '',
//   });

//   useEffect(() => {
//     fetchSubjects();
//     fetchTeachers();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       const response = await fetch('/api/subjects');
//       const data = await response.json();
//       setSubjects(data.subjects || []);
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

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
//       // Validate teacherId
//       if (!formData.teacherId || formData.teacherId.trim() === '') {
//         setError('Please select a teacher');
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         ...formData,
//         requiredPeriods: parseInt(formData.requiredPeriods),
//         teacherId: formData.teacherId, // Ensure teacherId is included
//       };

//       console.log('Submitting payload:', payload); // Debug log

//       const url = editingSubject
//         ? `/api/subjects/${editingSubject._id}`
//         : '/api/subjects';
//       const method = editingSubject ? 'PUT' : 'POST';

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

//       console.log('Subject saved:', data.subject); // Debug log
//       await fetchSubjects();
//       resetForm();
//       setLoading(false);
//     } catch (err: any) {
//       setError(err.message || 'An error occurred');
//       setLoading(false);
//     }
//   };

//   const handleEdit = (subject: Subject) => {
//     setEditingSubject(subject);
//     setFormData({
//       subject_name: subject.subject_name,
//       subject_code: subject.subject_code,
//       teacherId: subject.teacherId?._id || '',
//       requiredPeriods: subject.requiredPeriods.toString(),
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this subject?')) return;

//     try {
//       const response = await fetch(`/api/subjects/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         alert('Failed to delete subject');
//         return;
//       }

//       await fetchSubjects();
//     } catch (error) {
//       console.error('Error deleting subject:', error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       subject_name: '',
//       subject_code: '',
//       teacherId: '',
//       requiredPeriods: '',
//     });
//     setEditingSubject(null);
//     setShowForm(false);
//     setError('');
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Subject Management</h2>
//         <Button onClick={() => setShowForm(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Subject
//         </Button>
//       </div>

//       {showForm && (
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle>
//                 {editingSubject ? 'Edit Subject' : 'Add New Subject'}
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
//                     Subject Code
//                   </label>
//                   <Input
//                     value={formData.subject_code}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         subject_code: e.target.value.toUpperCase(),
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Teacher
//                   </label>
//                   <select
//                     value={formData.teacherId}
//                     onChange={(e) =>
//                       setFormData({ ...formData, teacherId: e.target.value })
//                     }
//                     className="w-full p-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select a teacher...</option>
//                     {teachers.map((teacher) => (
//                       <option key={teacher._id} value={teacher._id}>
//                         {teacher.faculty_name} ({teacher.teacherID})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Required Periods
//                   </label>
//                   <Input
//                     type="number"
//                     value={formData.requiredPeriods}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         requiredPeriods: e.target.value,
//                       })
//                     }
//                     required
//                     min="1"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button type="submit" disabled={loading}>
//                   {loading ? 'Saving...' : editingSubject ? 'Update' : 'Create'}
//                 </Button>
//                 <Button type="button" variant="outline" onClick={resetForm}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardHeader>
//           <CardTitle>All Subjects</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2 text-left">Code</th>
//                   <th className="border p-2 text-left">Name</th>
//                   <th className="border p-2 text-left">Teacher</th>
//                   <th className="border p-2 text-left">Required</th>
//                   <th className="border p-2 text-left">Allotted</th>
//                   <th className="border p-2 text-left">Remaining</th>
//                   <th className="border p-2 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subjects.map((subject) => (
//                   <tr key={subject._id}>
//                     <td className="border p-2">{subject.subject_code}</td>
//                     <td className="border p-2">{subject.subject_name}</td>
//                     <td className="border p-2">
//                       {subject.teacherId ? (
//                         subject.teacherId.faculty_name
//                       ) : (
//                         <span className="text-gray-400 italic">No teacher assigned</span>
//                       )}
//                     </td>
//                     <td className="border p-2">{subject.requiredPeriods}</td>
//                     <td className="border p-2">{subject.allottedPeriods}</td>
//                     <td className="border p-2">{subject.remainingPeriods}</td>
//                     <td className="border p-2">
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEdit(subject)}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           onClick={() => handleDelete(subject._id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
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
import { Plus, Edit, Trash2, X, BookOpen, Search, AlertCircle, ChevronRight, GraduationCap, CheckCircle2, Clock, BarChart3 } from 'lucide-react';

interface Teacher {
  _id: string;
  teacherID: string;
  faculty_name: string;
  department: string;
}

interface Subject {
  _id: string;
  subject_name: string;
  subject_code: string;
  teacherId: Teacher | null;
  requiredPeriods: number;
  allottedPeriods: number;
  remainingPeriods: number;
}

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: '',
    teacherId: '',
    requiredPeriods: '',
  });

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

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
      if (!formData.teacherId || formData.teacherId.trim() === '') {
        setError('Please select a teacher');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        requiredPeriods: parseInt(formData.requiredPeriods),
        teacherId: formData.teacherId,
      };

      const url = editingSubject ? `/api/subjects/${editingSubject._id}` : '/api/subjects';
      const method = editingSubject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Operation failed');
        setLoading(false);
        return;
      }

      await fetchSubjects();
      resetForm();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      teacherId: subject.teacherId?._id || '',
      requiredPeriods: subject.requiredPeriods.toString(),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      const response = await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
      if (!response.ok) { alert('Failed to delete subject'); return; }
      await fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const resetForm = () => {
    setFormData({ subject_name: '', subject_code: '', teacherId: '', requiredPeriods: '' });
    setEditingSubject(null);
    setShowForm(false);
    setError('');
  };

  const filtered = subjects.filter(s =>
    s.subject_name.toLowerCase().includes(search.toLowerCase()) ||
    s.subject_code.toLowerCase().includes(search.toLowerCase()) ||
    (s.teacherId?.faculty_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalPeriods = subjects.reduce((s, sub) => s + sub.requiredPeriods, 0);
  const allottedPeriods = subjects.reduce((s, sub) => s + sub.allottedPeriods, 0);
  const fullyAllocated = subjects.filter(s => s.remainingPeriods === 0).length;
  const unassigned = subjects.filter(s => !s.teacherId).length;

  /* ── Shared style tokens ── */
  const inputCls =
    'w-full px-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-700 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
    'hover:border-blue-300 transition-colors duration-150 placeholder:text-slate-300';

  const selectCls =
    'w-full px-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-700 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
    'hover:border-blue-300 transition-colors duration-150 appearance-none cursor-pointer';

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
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Curriculum</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Subject Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage subjects, assign teachers and track period allocation</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-md shadow-blue-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Subjects', value: subjects.length, icon: <BookOpen className="w-5 h-5" />, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
          { label: 'Total Periods', value: totalPeriods, icon: <Clock className="w-5 h-5" />, bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-100' },
          { label: 'Allotted', value: allottedPeriods, icon: <BarChart3 className="w-5 h-5" />, bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-100' },
          { label: 'Fully Allocated', value: fullyAllocated, icon: <CheckCircle2 className="w-5 h-5" />, bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-100' },
        ].map(({ label, value, icon, bg, text, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} shadow-sm px-5 py-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${text} shrink-0`}>
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
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              <p className="text-xs text-slate-400">Fill in subject details and assign a teacher</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Subject Name */}
                <div>
                  <label className={labelCls}>Subject Name</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Data Structures & Algorithms"
                    value={formData.subject_name}
                    onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                    required
                  />
                </div>

                {/* Subject Code */}
                <div>
                  <label className={labelCls}>Subject Code</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. CS301"
                    value={formData.subject_code}
                    onChange={(e) => setFormData({ ...formData, subject_code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                {/* Teacher */}
                <div>
                  <label className={labelCls}>Assign Teacher</label>
                  <div className="relative">
                    <select
                      value={formData.teacherId}
                      onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                      className={selectCls}
                      required
                    >
                      <option value="">Select a teacher…</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.faculty_name} · {teacher.teacherID} · {teacher.department}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-blue-400 pointer-events-none" />
                  </div>
                </div>

                {/* Required Periods */}
                <div>
                  <label className={labelCls}>Required Periods</label>
                  <input
                    type="number"
                    min="1"
                    className={inputCls}
                    placeholder="e.g. 4"
                    value={formData.requiredPeriods}
                    onChange={(e) => setFormData({ ...formData, requiredPeriods: e.target.value })}
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
                  ) : editingSubject ? 'Update Subject' : 'Create Subject'}
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

      {/* ── Subjects Table ── */}
      <div className={cardCls}>
        <div className={cardHeaderCls}>
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">All Subjects</h2>
            <p className="text-xs text-slate-400">
              {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
              {unassigned > 0 && <span className="ml-2 text-amber-500 font-semibold">· {unassigned} unassigned</span>}
            </p>
          </div>

          {/* Search */}
          <div className="ml-auto relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              className="w-full pl-8 pr-3 py-2 text-sm bg-blue-50 border border-blue-100 rounded-xl placeholder:text-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              placeholder="Search subjects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <BookOpen className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">{search ? 'No subjects match your search' : 'No subjects added yet'}</p>
              {!search && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-3 text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2"
                >
                  Add your first subject
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600">
                  {['Code', 'Subject Name', 'Assigned Teacher', 'Required', 'Allotted', 'Remaining', 'Progress', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-blue-100 whitespace-nowrap first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((subject, idx) => {
                  const pct = subject.requiredPeriods > 0
                    ? Math.round((subject.allottedPeriods / subject.requiredPeriods) * 100)
                    : 0;
                  const isComplete = subject.remainingPeriods === 0;
                  const isLow = !isComplete && subject.remainingPeriods <= 2 && subject.remainingPeriods > 0;

                  return (
                    <tr
                      key={subject._id}
                      className={`border-t border-blue-50 transition-colors hover:bg-blue-50/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/20'}`}
                    >
                      {/* Code */}
                      <td className="px-4 py-3 pl-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold tracking-wide">
                          {subject.subject_code}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 leading-tight">{subject.subject_name}</p>
                      </td>

                      {/* Teacher */}
                      <td className="px-4 py-3">
                        {subject.teacherId ? (
                          <div>
                            <p className="text-slate-700 font-medium text-sm">{subject.teacherId.faculty_name}</p>
                            <p className="text-xs text-slate-400">{subject.teacherId.department}</p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium">
                            <AlertCircle className="w-3 h-3" /> Unassigned
                          </span>
                        )}
                      </td>

                      {/* Required */}
                      <td className="px-4 py-3">
                        <span className="text-slate-700 font-semibold">{subject.requiredPeriods}</span>
                        <span className="text-slate-400 text-xs ml-1">per</span>
                      </td>

                      {/* Allotted */}
                      <td className="px-4 py-3 text-slate-600 font-medium">{subject.allottedPeriods}</td>

                      {/* Remaining */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isComplete
                            ? 'bg-green-100 text-green-700'
                            : isLow
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isComplete ? '✓ Done' : `${subject.remainingPeriods} left`}
                        </span>
                      </td>

                      {/* Progress bar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete ? 'bg-green-500' : isLow ? 'bg-amber-400' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 pr-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(subject._id)}
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

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-blue-50 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of {subjects.length} subjects
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
