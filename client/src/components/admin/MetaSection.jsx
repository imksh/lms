import React, { useState, useEffect } from "react";
import { Globe, Palette, Users, CheckCircle, Save } from "lucide-react";
import { cmsService } from "../../services/cmsService";
import { Field, inputCls } from "../common/SharedFields";

const MetaSection = () => {
  const [meta, setMeta] = useState({
    lmsTitle: "",
    lmsTagline: "",
    primaryColor: "#6366f1",
    contactEmail: "",
    footerText: "",
    socialLinks: { github: "", twitter: "", linkedin: "" },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    cmsService.getMeta().then(({ data }) => setMeta(data)).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await cmsService.updateMeta(meta);
      setMeta(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Branding */}
        <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-5">
          <h3 className="text-sm font-extrabold flex items-center gap-2 text-base-content/70">
            <Palette size={14} /> Branding
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Platform Title">
              <input className={inputCls} value={meta.lmsTitle} onChange={(e) => setMeta((p) => ({ ...p, lmsTitle: e.target.value }))} placeholder="MERN Stack LMS" />
            </Field>
            <Field label="Tagline">
              <input className={inputCls} value={meta.lmsTagline} onChange={(e) => setMeta((p) => ({ ...p, lmsTagline: e.target.value }))} placeholder="Learn, Build, Ship." />
            </Field>
            <Field label="Primary Color">
              <div className="flex items-center gap-2">
                <input type="color" value={meta.primaryColor} onChange={(e) => setMeta((p) => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-9 rounded-lg border border-base-300 cursor-pointer bg-base-100 p-0.5" />
                <input className={inputCls} value={meta.primaryColor} onChange={(e) => setMeta((p) => ({ ...p, primaryColor: e.target.value }))} placeholder="#6366f1" />
              </div>
            </Field>
            <Field label="Contact Email">
              <input className={inputCls} type="email" value={meta.contactEmail} onChange={(e) => setMeta((p) => ({ ...p, contactEmail: e.target.value }))} placeholder="hello@lms.dev" />
            </Field>
          </div>
          <Field label="Footer Text">
            <input className={inputCls} value={meta.footerText} onChange={(e) => setMeta((p) => ({ ...p, footerText: e.target.value }))} placeholder="© 2025 LMS Platform. All rights reserved." />
          </Field>
        </div>

        {/* Social Links */}
        <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-5">
          <h3 className="text-sm font-extrabold flex items-center gap-2 text-base-content/70">
            <Users size={14} /> Social Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["github", "twitter", "linkedin"].map((k) => (
              <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                <input className={inputCls} value={meta.socialLinks?.[k] || ""} onChange={(e) => setMeta((p) => ({ ...p, socialLinks: { ...p.socialLinks, [k]: e.target.value } }))} placeholder={`https://${k}.com/...`} />
              </Field>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary rounded-2xl font-bold self-start px-8 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-transform">
          {saving ? <span className="loading loading-spinner loading-xs" /> : saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Settings</>}
        </button>
      </form>
    </div>
  );
};

export default MetaSection;
