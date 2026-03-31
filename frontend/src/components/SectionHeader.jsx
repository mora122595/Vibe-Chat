const SectionHeader = ({ icon: Icon, title, badge }) => (
  <div className="flex gap-4 justify-between pb-4">
    <div className="flex items-center gap-2">
      <Icon className="size-5 text-primary" />
      <p className="font-bold text-lg">{title}</p>
    </div>
    {badge}
  </div>
);

export default SectionHeader;
