"use client"
export default function InputField({label, type = "text", register, name, defval, error, inputProps, hidden}) {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defval}
      />
      {error?.message && (
        <p className="text-xs text-red-400">
          {error?.message.toString()}
        </p>
      )}
    </div>
  );
}