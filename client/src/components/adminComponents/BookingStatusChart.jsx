import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip as ReTooltip, ResponsiveContainer } from "recharts";
import { FaCalendarCheck } from "react-icons/fa";

export default function BookingStatusChart({ data }) {
  const COLORS = ["#facc15", "#10b981", "#ef4444"]; 

  return (
    <section className="rounded-2xl border dark:border-gray-800 bg-white/80 dark:bg-gray-900 shadow-sm p-5 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <FaCalendarCheck className="text-purple-500" />
        Bookings Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ReTooltip
            formatter={(value, name, props) => [`${value} (${(props.percent * 100).toFixed(1)}%)`, name]}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}
