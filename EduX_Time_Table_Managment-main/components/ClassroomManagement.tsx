'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Classroom {
  _id: string;
  program: string;
  className: string;
  semester: number;
  division: string;
  roomNumber?: string;
  year?: string;
}

const PROGRAMS = [
  'Information Technology',
  'Cyber Security',
  'Computer Science & Technology',
  'Computer Engineering',
  'Artificial Intelligence & Data Science',
];

const CLASS_LEVELS = ['FY', 'SY', 'TY'];
const SEMESTERS = [1, 2, 3, 4, 5, 6];
const DIVISIONS = ['A', 'B', 'C'];

export default function ClassroomManagement() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    program: '',
    className: '',
    semester: '',
    division: '',
    roomNumber: '',
    year: '',
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('/api/classrooms');
      const data = await response.json();
      setClassrooms(data.classrooms || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        semester: parseInt(formData.semester),
        roomNumber: formData.roomNumber || undefined,
        year: formData.year || undefined,
      };

      const url = editingClassroom
        ? `/api/classrooms/${editingClassroom._id}`
        : '/api/classrooms';
      const method = editingClassroom ? 'PUT' : 'POST';

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

      await fetchClassrooms();
      resetForm();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      program: classroom.program,
      className: classroom.className,
      semester: classroom.semester.toString(),
      division: classroom.division,
      roomNumber: classroom.roomNumber || '',
      year: classroom.year || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this classroom?')) return;

    try {
      const response = await fetch(`/api/classrooms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete classroom');
        return;
      }

      await fetchClassrooms();
    } catch (error) {
      console.error('Error deleting classroom:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      program: '',
      className: '',
      semester: '',
      division: '',
      roomNumber: '',
      year: '',
    });
    setEditingClassroom(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Classroom Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Classroom
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Program / Department
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) =>
                      setFormData({ ...formData, program: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select program...</option>
                    {PROGRAMS.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Class Name
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) =>
                      setFormData({ ...formData, className: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select class...</option>
                    {CLASS_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select semester...</option>
                    {SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Division
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) =>
                      setFormData({ ...formData, division: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select division...</option>
                    {DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Room Number (Optional)
                  </label>
                  <Input
                    value={formData.roomNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, roomNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Year (Optional)
                  </label>
                  <Input
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingClassroom ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Classrooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Program</th>
                  <th className="border p-2 text-left">Class</th>
                  <th className="border p-2 text-left">Semester</th>
                  <th className="border p-2 text-left">Division</th>
                  <th className="border p-2 text-left">Room Number</th>
                  <th className="border p-2 text-left">Year</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom) => (
                  <tr key={classroom._id}>
                    <td className="border p-2">{classroom.program}</td>
                    <td className="border p-2">{classroom.className}</td>
                    <td className="border p-2">{classroom.semester}</td>
                    <td className="border p-2">{classroom.division}</td>
                    <td className="border p-2">
                      {classroom.roomNumber || (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="border p-2">
                      {classroom.year || (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(classroom)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(classroom._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   Plus, Edit, Trash2, X, Building2, Search,
//   AlertCircle, ChevronRight, LayoutGrid, GraduationCap, DoorOpen, CalendarDays,
// } from 'lucide-react';

// interface Classroom {
//   _id: string;
//   program: string;
//   className: string;
//   semester: number;
//   division: string;
//   roomNumber?: string;
//   year?: string;
// }

// const PROGRAMS = [
//   'Information Technology',
//   'Cyber Security',
//   'Computer Science & Technology',
//   'Computer Engineering',
//   'Artificial Intelligence & Data Science',
// ];
// const CLASS_LEVELS = ['FY', 'SY', 'TY'];
// const SEMESTERS = [1, 2, 3, 4, 5, 6];
// const DIVISIONS = ['A', 'B', 'C','D','E','F','G'];

// /* ── Program short labels for badge display ── */
// const PROGRAM_SHORT: Record<string, string> = {
//   'Information Technology': 'IT',
//   'Cyber Security': 'CS',
//   'Computer Science & Technology': 'CST',
//   'Computer Engineering': 'CE',
//   'Artificial Intelligence & Data Science': 'AIDS',
// };

// /* ── Program badge colors (cycling) ── */
// const PROGRAM_COLORS = [
//   'bg-blue-100 text-blue-700',
//   'bg-indigo-100 text-indigo-700',
//   'bg-sky-100 text-sky-700',
//   'bg-violet-100 text-violet-700',
//   'bg-cyan-100 text-cyan-700',
// ];

// export default function ClassroomManagement() {
//   const [classrooms, setClassrooms] = useState<Classroom[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
//   const [error, setError] = useState('');
//   const [search, setSearch] = useState('');
//   const [formData, setFormData] = useState({
//     program: '', className: '', semester: '', division: '', roomNumber: '', year: '',
//   });

//   useEffect(() => { fetchClassrooms(); }, []);

//   const fetchClassrooms = async () => {
//     try {
//       const response = await fetch('/api/classrooms');
//       const data = await response.json();
//       setClassrooms(data.classrooms || []);
//     } catch (error) { console.error('Error fetching classrooms:', error); }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const payload = {
//         ...formData,
//         semester: parseInt(formData.semester),
//         roomNumber: formData.roomNumber || undefined,
//         year: formData.year || undefined,
//       };
//       const url = editingClassroom ? `/api/classrooms/${editingClassroom._id}` : '/api/classrooms';
//       const method = editingClassroom ? 'PUT' : 'POST';
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await response.json();
//       if (!response.ok) { setError(data.error || 'Operation failed'); setLoading(false); return; }
//       await fetchClassrooms();
//       resetForm();
//       setLoading(false);
//     } catch (err: any) {
//       setError(err.message || 'An error occurred');
//       setLoading(false);
//     }
//   };

//   const handleEdit = (classroom: Classroom) => {
//     setEditingClassroom(classroom);
//     setFormData({
//       program: classroom.program,
//       className: classroom.className,
//       semester: classroom.semester.toString(),
//       division: classroom.division,
//       roomNumber: classroom.roomNumber || '',
//       year: classroom.year || '',
//     });
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this classroom?')) return;
//     try {
//       const response = await fetch(`/api/classrooms/${id}`, { method: 'DELETE' });
//       if (!response.ok) {
//         const data = await response.json();
//         alert(data.error || 'Failed to delete classroom');
//         return;
//       }
//       await fetchClassrooms();
//     } catch (error) { console.error('Error deleting classroom:', error); }
//   };

//   const resetForm = () => {
//     setFormData({ program: '', className: '', semester: '', division: '', roomNumber: '', year: '' });
//     setEditingClassroom(null);
//     setShowForm(false);
//     setError('');
//   };

//   const filtered = classrooms.filter(c =>
//     c.program.toLowerCase().includes(search.toLowerCase()) ||
//     c.className.toLowerCase().includes(search.toLowerCase()) ||
//     c.division.toLowerCase().includes(search.toLowerCase()) ||
//     (c.roomNumber || '').toLowerCase().includes(search.toLowerCase()) ||
//     (c.year || '').toLowerCase().includes(search.toLowerCase())
//   );

//   /* ── Stats ── */
//   const uniquePrograms = new Set(classrooms.map(c => c.program)).size;
//   const withRoom = classrooms.filter(c => c.roomNumber).length;
//   const divisions = new Set(classrooms.map(c => `${c.program}-${c.className}-${c.semester}-${c.division}`)).size;

//   /* ── Style tokens ── */
//   const selectCls =
//     'w-full px-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-700 ' +
//     'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
//     'hover:border-blue-300 transition-colors duration-150 appearance-none cursor-pointer ' +
//     'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';

//   const inputCls =
//     'w-full px-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-700 ' +
//     'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
//     'hover:border-blue-300 transition-colors duration-150 placeholder:text-slate-300';

//   const cardCls = 'bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden';
//   const cardHeaderCls = 'px-6 py-4 border-b border-blue-50 flex items-center gap-3';
//   const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

//   const getProgramColor = (program: string) =>
//     PROGRAM_COLORS[PROGRAMS.indexOf(program) % PROGRAM_COLORS.length];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4 md:p-8 space-y-6 font-sans">

//       {/* ── Page Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
//               <Building2 className="w-4 h-4 text-white" />
//             </div>
//             <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Setup</span>
//           </div>
//           <h1 className="text-2xl font-bold text-slate-800">Classroom Management</h1>
//           <p className="text-sm text-slate-500 mt-0.5">Configure programs, divisions, semesters and room assignments</p>
//         </div>
//         <button
//           onClick={() => { resetForm(); setShowForm(true); }}
//           className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-md shadow-blue-200 self-start sm:self-auto"
//         >
//           <Plus className="w-4 h-4" /> Add Classroom
//         </button>
//       </div>

//       {/* ── Stats Row ── */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[
//           { label: 'Total Classrooms', value: classrooms.length, icon: <Building2 className="w-5 h-5" />, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
//           { label: 'Programs', value: uniquePrograms, icon: <GraduationCap className="w-5 h-5" />, bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-100' },
//           { label: 'Divisions', value: divisions, icon: <LayoutGrid className="w-5 h-5" />, bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-100' },
//           { label: 'With Room No.', value: withRoom, icon: <DoorOpen className="w-5 h-5" />, bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-100' },
//         ].map(({ label, value, icon, bg, text, border }) => (
//           <div key={label} className={`bg-white rounded-2xl border ${border} shadow-sm px-5 py-4 flex items-center gap-4`}>
//             <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${text} shrink-0`}>
//               {icon}
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-slate-800">{value}</p>
//               <p className="text-xs text-slate-400 font-medium">{label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Add / Edit Form ── */}
//       {showForm && (
//         <div className={cardCls}>
//           <div className={cardHeaderCls}>
//             <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
//               <Building2 className="w-4 h-4 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}
//               </h2>
//               <p className="text-xs text-slate-400">Fill in the classroom and program details</p>
//             </div>
//             <button
//               onClick={resetForm}
//               className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="p-6">
//             {error && (
//               <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
//                 <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Required fields */}
//               <div>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Required Information</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//                   {/* Program */}
//                   <div className="xl:col-span-2">
//                     <label className={labelCls}>Program / Department</label>
//                     <div className="relative">
//                       <select
//                         value={formData.program}
//                         onChange={(e) => setFormData({ ...formData, program: e.target.value })}
//                         className={selectCls}
//                         required
//                       >
//                         <option value="">Select program…</option>
//                         {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
//                       </select>
//                       <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-blue-400 pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* Class */}
//                   <div>
//                     <label className={labelCls}>Class Level</label>
//                     <div className="relative">
//                       <select
//                         value={formData.className}
//                         onChange={(e) => setFormData({ ...formData, className: e.target.value })}
//                         className={selectCls}
//                         required
//                       >
//                         <option value="">Select class…</option>
//                         {CLASS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
//                       </select>
//                       <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-blue-400 pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* Semester */}
//                   <div>
//                     <label className={labelCls}>Semester</label>
//                     <div className="relative">
//                       <select
//                         value={formData.semester}
//                         onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
//                         className={selectCls}
//                         required
//                       >
//                         <option value="">Select semester…</option>
//                         {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
//                       </select>
//                       <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-blue-400 pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* Division */}
//                   <div>
//                     <label className={labelCls}>Division</label>
//                     <div className="relative">
//                       <select
//                         value={formData.division}
//                         onChange={(e) => setFormData({ ...formData, division: e.target.value })}
//                         className={selectCls}
//                         required
//                       >
//                         <option value="">Select division…</option>
//                         {DIVISIONS.map(d => <option key={d} value={d}>Division {d}</option>)}
//                       </select>
//                       <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-blue-400 pointer-events-none" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Optional fields */}
//               <div>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Optional Details</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelCls}>Room Number <span className="normal-case text-slate-300 font-normal">(optional)</span></label>
//                     <input
//                       className={inputCls}
//                       placeholder="e.g. 301, Lab-A"
//                       value={formData.roomNumber}
//                       onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
//                     />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Academic Year <span className="normal-case text-slate-300 font-normal">(optional)</span></label>
//                     <input
//                       className={inputCls}
//                       placeholder="e.g. 2024-25"
//                       value={formData.year}
//                       onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-1">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white text-sm font-bold transition-all shadow-md shadow-blue-200"
//                 >
//                   {loading ? (
//                     <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" /> Saving…</>
//                   ) : editingClassroom ? 'Update Classroom' : 'Create Classroom'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ── Classrooms Table ── */}
//       <div className={cardCls}>
//         <div className={cardHeaderCls}>
//           <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
//             <LayoutGrid className="w-4 h-4 text-blue-600" />
//           </div>
//           <div>
//             <h2 className="text-base font-semibold text-slate-800">All Classrooms</h2>
//             <p className="text-xs text-slate-400">
//               {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''} configured
//             </p>
//           </div>

//           {/* Search */}
//           <div className="ml-auto relative w-56">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//             <input
//               className="w-full pl-8 pr-3 py-2 text-sm bg-blue-50 border border-blue-100 rounded-xl placeholder:text-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
//               placeholder="Search classrooms…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           {filtered.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-slate-400">
//               <Building2 className="w-10 h-10 mb-3 opacity-30" />
//               <p className="text-sm font-medium">
//                 {search ? 'No classrooms match your search' : 'No classrooms configured yet'}
//               </p>
//               {!search && (
//                 <button
//                   onClick={() => setShowForm(true)}
//                   className="mt-3 text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2"
//                 >
//                   Add your first classroom
//                 </button>
//               )}
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-blue-600">
//                   {['Program', 'Class', 'Semester', 'Division', 'Room No.', 'Acad. Year', 'Actions'].map(h => (
//                     <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-blue-100 whitespace-nowrap first:pl-6 last:pr-6">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((classroom, idx) => (
//                   <tr
//                     key={classroom._id}
//                     className={`border-t border-blue-50 transition-colors hover:bg-blue-50/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/20'}`}
//                   >
//                     {/* Program */}
//                     <td className="px-4 py-3 pl-6">
//                       <div className="flex items-center gap-2">
//                         <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold ${getProgramColor(classroom.program)}`}>
//                           {PROGRAM_SHORT[classroom.program] || 'N/A'}
//                         </span>
//                         <span className="text-slate-600 text-sm truncate max-w-[180px]" title={classroom.program}>
//                           {classroom.program}
//                         </span>
//                       </div>
//                     </td>

//                     {/* Class */}
//                     <td className="px-4 py-3">
//                       <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
//                         {classroom.className}
//                       </span>
//                     </td>

//                     {/* Semester */}
//                     <td className="px-4 py-3">
//                       <span className="inline-flex items-center gap-1 text-slate-700 font-semibold text-sm">
//                         <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
//                         Sem {classroom.semester}
//                       </span>
//                     </td>

//                     {/* Division */}
//                     <td className="px-4 py-3">
//                       <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
//                         Div {classroom.division}
//                       </span>
//                     </td>

//                     {/* Room Number */}
//                     <td className="px-4 py-3">
//                       {classroom.roomNumber ? (
//                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
//                           <DoorOpen className="w-3 h-3" /> {classroom.roomNumber}
//                         </span>
//                       ) : (
//                         <span className="text-slate-300 text-xs italic">Not assigned</span>
//                       )}
//                     </td>

//                     {/* Year */}
//                     <td className="px-4 py-3">
//                       {classroom.year ? (
//                         <span className="text-slate-600 text-sm font-medium">{classroom.year}</span>
//                       ) : (
//                         <span className="text-slate-300 text-xs italic">—</span>
//                       )}
//                     </td>

//                     {/* Actions */}
//                     <td className="px-4 py-3 pr-6">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleEdit(classroom)}
//                           className="w-8 h-8 rounded-lg flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
//                           title="Edit"
//                         >
//                           <Edit className="w-3.5 h-3.5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(classroom._id)}
//                           className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Footer */}
//         {filtered.length > 0 && (
//           <div className="px-6 py-3 border-t border-blue-50 flex items-center justify-between">
//             <p className="text-xs text-slate-400">
//               Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of {classrooms.length} classrooms
//             </p>
//             {search && (
//               <button
//                 onClick={() => setSearch('')}
//                 className="text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2"
//               >
//                 Clear search
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }