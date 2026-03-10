import React from "react";
import { useState, type FC } from "react";
import { useLoaderData, useSearchParams } from "react-router";

type T_province = {
  id: number;
  name: string;
};
type T_district = {
  id: number;
  name: string;
  regency_id: number;
};
type T_regency = {
  id: number;
  name: string;
  province_id: number;
};

interface I_data {
  province: T_province[];
  regencies: T_regency[];
  districts: T_district[];
}

interface I_region {
  province?: T_province;
  regencies?: T_regency;
  districts?: T_district;
}

export default function FilterPage() {
  const data = useLoaderData<I_data>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [region, setRegion] = useState<I_region>({
    province: data.province.find(
      ({ id }) => Number(searchParams.get("province")) === id,
    ),
    districts: data.districts.find(
      ({ id }) => Number(searchParams.get("districts")) === id,
    ),
    regencies: data.regencies.find(
      ({ id }) => Number(searchParams.get("regency")) === id,
    ),
  });

  const setRegionHandler = (
    val: T_province | T_regency | T_district,
    name: string,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const updatedRegion = structuredClone(region);
    if (name === "province") {
      newSearchParams.set("province", val.id.toString());
      updatedRegion.province = val as T_province;
      updatedRegion.regencies = undefined;
      updatedRegion.districts = undefined;
      newSearchParams.delete("regency");
      newSearchParams.delete("districts");
    }
    if (name === "regency") {
      newSearchParams.set("regency", val.id.toString());
      updatedRegion.regencies = val as T_regency;
      updatedRegion.districts = undefined;
      newSearchParams.delete("districts");
    }
    if (name === "district") {
      newSearchParams.set("districts", val.id.toString());
      updatedRegion.districts = val as T_district;
    }
    setRegion(updatedRegion);
    setSearchParams(newSearchParams);
  };
  const resetHandler = () => {
    const updatedRegion = structuredClone(region);
    updatedRegion.province = undefined;
    updatedRegion.regencies = undefined;
    updatedRegion.districts = undefined;
    setRegion(updatedRegion);
    setSearchParams({});
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <aside className="w-70 min-w-70 bg-white border-r border-slate-100 flex flex-col px-5 py-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-9">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500">
            <GlobeIcon />
          </div>
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">
            Frontend Assessment
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-5 text-slate-400">
            <FilterIcon />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              Filter Wilayah
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="province">Provinsi</label>
              <Select
                label="province"
                disabled={false}
                placeholder="Pilih provinsi."
                onChange={setRegionHandler}
                options={data.province}
                value={region.province?.name}
                icon={<MapIcon />}
              />
            </div>

            <div>
              <label htmlFor="regency">Kota/Kabupaten</label>
              <Select
                icon={<BuildingIcon />}
                label="regency"
                disabled={region.province ? false : true}
                placeholder="-"
                onChange={setRegionHandler}
                options={data.regencies.filter(
                  ({ province_id }) => province_id === region.province?.id,
                )}
                value={region.regencies?.name}
              />
            </div>

            <div>
              <label htmlFor="district">Kecamatan</label>
              <Select
                icon={<PinIcon />}
                label="district"
                disabled={region.regencies ? false : true}
                placeholder="-"
                onChange={setRegionHandler}
                options={data.districts.filter(
                  ({ regency_id }) => regency_id === region.regencies?.id,
                )}
                value={region.districts?.name}
              />
            </div>
          </div>
        </div>
        <button
          onClick={resetHandler}
          className="mt-6 w-full py-3 px-4 rounded-xl border border-blue-500 text-blue-500 bg-transparent text-[13px] font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-blue-50 cursor-pointer"
        >
          <FilterIcon />
          Reset
        </button>
        <a
          className="font-light text-xs mt-2 py-1 px-2 rounded-xl border border-stone-950 text-stone-800 bg-transparent flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-blue-50 cursor-pointer"
          href={"https://github.com/martines205/kledo-Assesment.git"}
          target="_blank"
        >
          <GitHubIcon />
          Github
        </a>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-13 bg-white border-b border-slate-100 flex items-center px-8">
          <BreadCrumb region={{ ...region }} className={"breadcrumb"} />
        </header>
        <div className="flex-1 bg-slate-50 flex items-center justify-center">
          <DisplayPanel content={region} />
        </div>
      </main>
    </div>
  );
}

// =================================

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="#000000"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    // style="opacity:1;"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const MapIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const BuildingIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="9" y1="22" x2="9" y2="12" />
    <line x1="15" y1="22" x2="15" y2="12" />
    <rect x="9" y="7" width="6" height="5" />
  </svg>
);

const PinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ArrowDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

interface I_Select<T> {
  label: string;
  disabled: boolean;
  placeholder: string;
  options: T[];
  onChange: (val: T, name: string) => void;
  value?: string;
  icon?: React.ReactNode;
}

const Select: FC<I_Select<T_province | T_district | T_regency>> = ({
  disabled,
  placeholder,
  options,
  onChange,
  value,
  label,
  icon,
}) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find((opt) => opt.name === e.target.value);
    const name = e.target.name;
    if (selectedOption) {
      onChange(selectedOption, name);
    }
  };
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-blue-400">
        {icon}
      </div>
      <select
        value={value}
        name={label}
        id={label}
        disabled={disabled}
        onChange={onChangeHandler}
        className={[
          "w-full py-2.5 pl-8 pr-9 text-sm rounded-xl border appearance-none outline-none transition-colors duration-200",
          "focus:border-blue-500",
          disabled
            ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-60 border-slate-200"
            : "bg-white cursor-pointer border-slate-200 hover:border-slate-300",
          value ? "text-slate-800" : "text-slate-400",
        ].join(" ")}
      >
        <option value="">{placeholder}</option>
        {options.map(({ name }) => (
          <option key={crypto.randomUUID()} value={name}>
            {name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
};

interface I_breadCrumb {
  region: I_region;
  className: string;
}
const BreadCrumb: FC<I_breadCrumb> = ({ region, className }) => {
  const crumbs: string[] = ["Indonesia"];
  if (region.province) crumbs.push(region.province.name);
  if (region.regencies) crumbs.push(region.regencies.name);
  if (region.regencies && region.districts) crumbs.push(region.districts.name);
  return (
    <div className={[className].join("")}>
      <span key={crypto.randomUUID()} className="flex items-center gap-1.5">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-300">›</span>}
            <span
              className={
                i === crumbs.length - 1
                  ? "text-blue-500 font-semibold"
                  : "text-slate-400"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
};

interface I_display {
  content: I_region;
}
const DisplayPanel: FC<I_display> = ({ content }) => {
  const contentList = Object.keys(content)
    .map((v) => {
      if (v === "province")
        return {
          label: "Provinsi",
          value: content.province?.name,
        };
      if (v === "districts")
        return {
          label: "Kota/Kabupaten",
          value: content.districts?.name,
        };
      if (v === "regencies")
        return {
          label: "Kecamatan",
          value: content.regencies?.name,
        };
    })
    .filter(
      (v): v is { label: string; value: string } => v?.value !== undefined,
    );

  if (content.province === undefined) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-300 gap-3">
        <GlobeIcon />
        <p className="text-sm">Pilih wilayah untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {contentList.map((content, i) => (
        <div key={crypto.randomUUID()} className="flex flex-col items-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold tracking-widest text-blue-300 uppercase">
              {content?.label}
            </span>
            <span
              className={[
                "font-extrabold text-slate-900 leading-tight",
                contentList.length === 1 ? "text-7xl" : "text-5xl",
              ].join(" ")}
            >
              {content.value}
            </span>
          </div>

          {i < contentList.length - 1 && (
            <div className="my-5 text-blue-200">
              <ArrowDown />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
