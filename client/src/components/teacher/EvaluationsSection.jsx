import React, { useState, useEffect } from "react";
import { Inbox, CheckCircle, AlertTriangle, Clock, ArrowLeft, Award } from "lucide-react";
import { submissionService } from "../../services/submissionService";
import { Field, inputCls, textareaCls } from "../common/SharedFields";
import AdminLayout from "../layouts/AdminLayout";

const EvaluationsSection = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: "approved", grade: 10, feedback: "" });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    submissionService.getAllSubmissions().then(({ data }) => setEvaluations(data)).catch(console.error);
  }, []);

  const filtered = evaluations.filter((e) => filter === "all" || e.status === filter);
  const pendingCount = evaluations.filter((e) => e.status === "pending").length;

  const selectEval = (ev) => {
    setSelected(ev);
    setForm({
      status: ev.status === "pending" ? "approved" : ev.status,
      grade: ev.grade ?? 10,
      feedback: ev.feedback || "",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await submissionService.evaluate(selected._id, form.status, form.grade, form.feedback);
      setEvaluations((prev) => prev.map((item) => (item._id === data._id ? data : item)));
      setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (s) => ({ pending: "badge-warning", approved: "badge-success", rejected: "badge-error" }[s] || "badge-neutral");
  const statusIcon = (s) => ({ pending: <Clock size={11} />, approved: <CheckCircle size={11} />, rejected: <AlertTriangle size={11} /> }[s]);

  const tabsEl = (
    <div className="tabs tabs-box bg-base-200 p-1 rounded-xl flex gap-0.5 border border-base-300/40">
      {["all", "pending", "approved", "rejected"].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`tab tab-xs font-bold rounded-lg capitalize ${filter === f ? "tab-active bg-primary text-primary-content!" : ""}`}
        >
          {f}
        </button>
      ))}
    </div>
  );

  return (
    <AdminLayout
      actions={
        !selected ? (
          <div className="hidden md:flex">
            {tabsEl}
          </div>
        ) : null
      }
    >
      <div className="p-6">
        {!selected ? (
          <>
            {/* Mobile-only tab display */}
            <div className="flex md:hidden items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {pendingCount > 0 && <span className="badge badge-warning font-bold">{pendingCount} pending</span>}
              </div>
              {tabsEl}
            </div>

            <div className="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto pr-1 max-w-3xl mx-auto">
              {filtered.length === 0 && (
                <div className="bg-base-200/50 border border-dashed border-base-300 rounded-2xl p-8 text-center text-sm text-base-content/40">
                  No {filter === "all" ? "" : filter} submissions
                </div>
              )}
              {filtered.map((ev) => (
                <button
                  key={ev._id}
                  onClick={() => selectEval(ev)}
                  className="text-left card border rounded-2xl p-4 transition-all hover:border-primary/30 bg-base-200/60 border-base-300/60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold truncate">{ev.topicId}</p>
                      <p className="text-[11px] text-base-content/50 mt-0.5">
                        {ev.user?.name || "Student"} · Section {ev.sectionIndex + 1}
                      </p>
                      <p className="text-[11px] text-base-content/40 mt-0.5 line-clamp-1">{ev.submittedContent}</p>
                    </div>
                    <span className={`badge badge-xs font-bold flex gap-1 items-center shrink-0 ${statusBadge(ev.status)}`}>
                      {statusIcon(ev.status)} {ev.status}
                    </span>
                  </div>
                  {ev.grade !== null && <p className="text-[11px] text-base-content/50 mt-1.5 font-bold">Grade: {ev.grade}</p>}
                </button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={submit} className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between pb-2 border-b border-base-300/40">
              <div>
                <h3 className="text-sm font-extrabold">Evaluate Submission</h3>
                <p className="text-[11px] text-base-content/50 mt-0.5">Student: {selected.user?.name || "Student"} · Topic: {selected.topicId}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="btn btn-sm btn-circle btn-ghost" title="Back to list"><ArrowLeft size={16} /></button>
            </div>
            <div className="bg-base-100 rounded-2xl p-3 border border-base-300">
              <p className="text-[10px] font-black text-base-content/40 mb-1 uppercase">Submitted Content</p>
              <pre className="text-xs font-mono whitespace-pre-wrap text-base-content/70 max-h-48 overflow-y-auto">{selected.submittedContent}</pre>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <select className="select select-sm select-bordered bg-base-100 rounded-xl text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </Field>
              <Field label="Grade">
                <input className={inputCls} type="number" min={0} max={100} value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: +e.target.value }))} />
              </Field>
            </div>
            <Field label="Feedback">
              <textarea className={textareaCls} rows={4} value={form.feedback} onChange={(e) => setForm((p) => ({ ...p, feedback: e.target.value }))} placeholder="Great work! Consider improving..." />
            </Field>
            <button type="submit" disabled={saving} className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center justify-center shadow-md py-2.5">
              {saving ? <span className="loading loading-spinner loading-xs" /> : <><Award size={14} /> Submit Evaluation</>}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default EvaluationsSection;
