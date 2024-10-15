// GroupList.jsx
import React from 'react';
import { Avatar, Text, ScrollArea, Box } from '@mantine/core';

// GroupListItem Component
const GroupListItem = ({ name }) => {
    return (
        <Box style={{ margin: '0 8px' }}>
            <Avatar size="xl" radius="xl" />
            <Text size="xs" mt="sm">{name}</Text>
        </Box>
    );
};

// GroupList Component
const GroupList = ({ groups }) => {
    return (
        <ScrollArea style={{ whiteSpace: 'nowrap', overflowX: 'auto' }} className='border-bottom'>
            <div style={{ display: 'flex', padding: 8, maxWidth: 300 }}> {/* I mean, this works.... */}
                {groups.map((group, index) => (
                    <GroupListItem key={index} name={group.name} />
                ))}
            </div>
        </ScrollArea>
    );
};

export default GroupList;


// import React from 'react';
// import { Avatar, Text, ScrollArea, Box } from '@mantine/core';

// const StoryList = ({ stories }) => {
//   return (
//     <ScrollArea style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
//       <div style={{ display: 'flex', padding: '1rem' }}>
//         {stories.map((story, index) => (
//           <Story key={index} story={story} />
//         ))}
//       </div>
//     </ScrollArea>
//   );
// };

// const Story = ({ story }) => {
//   return (
//     <Box style={{ marginRight: '1rem' }}>
//       <Avatar size="xl" radius="xl" src={story.user.avatar} />
//       <Text size="xs" mt="sm">{story.content}</Text>
//     </Box>
//   );
// };

// export default StoryList;