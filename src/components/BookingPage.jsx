<Select
  name="childId"
  value={formik.values.childId}
  onValueChange={handleSelectChange}
>
  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
    <SelectValue placeholder="Select a child" className="text-gray-500" />
  </SelectTrigger>
  <SelectContent>
    {childs.length > 0 ? (
      childs.map((child) => {
        const childId = (child.id || child.childId || Math.floor(Math.random() * 10000) + 1).toString();
        const childName = child.name || 
          (child.firstName && child.lastName ? `${child.firstName} ${child.lastName}` : 
          "Child " + childId);
        
        return (
          <SelectItem 
            key={`child-${childId}`} 
            value={childId}
            className="text-gray-900 hover:bg-gray-100"
          >
            {childName}
          </SelectItem>
        );
      })
    ) : (
      <SelectItem value="no-child" disabled className="text-gray-500">
        No children found
      </SelectItem>
    )}
  </SelectContent>
</Select> 