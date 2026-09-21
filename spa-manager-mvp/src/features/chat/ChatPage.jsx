import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postChat, getChatExamples, getChatHistory } from '../api/services';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { 
  Card, Title, Text, Stack, TextInput, Button, Loader, 
  Center, Box, Group, Badge, ScrollArea, Divider, Table
} from '@mantine/core';
import { IconSend, IconMessageChatbot, IconRobot } from '@tabler/icons-react';

export const ChatPage = () => {
  const { selectedObject } = useObjectSwitch();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const scrollRef = useRef(null);
  
  const { data: examplesData } = useQuery({
    queryKey: ['chat-examples'],
    queryFn: getChatExamples,
  });

  const chatMutation = useMutation({
    mutationFn: postChat,
    onMutate: () => {
      // Add user message to history immediately
      setChatHistory(prev => [...prev, { role: 'user', content: message }]);
      setMessage('');
    },
    onSuccess: (data) => {
      // Add AI response to history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        ...data.data 
      }]);
    },
  });

  const examples = examplesData?.data?.examples || [];

  const handleSend = () => {
    if (!message.trim()) return;
    
    chatMutation.mutate({
      message: message,
      location: selectedObject,
    });
  };

  const handleExampleClick = (exampleText) => {
    setMessage(exampleText);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <Stack gap="lg" h="calc(100vh - 140px)">
      <Title order={2}>Чат с ИИ-помощником</Title>

      {/* Examples */}
      {examples.length > 0 && chatHistory.length === 0 && (
        <Card p="md" withBorder>
          <Text size="sm" c="dimmed" mb="xs">Примеры вопросов:</Text>
          <Group gap="xs">
            {examples.map((example, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Badge>
            ))}
          </Group>
        </Card>
      )}

      {/* Chat History */}
      <Card p="md" withBorder style={{ flex: 1, overflow: 'hidden' }}>
        <ScrollArea h="100%" ref={scrollRef}>
          <Stack gap="md">
            {chatHistory.length === 0 ? (
              <Center h="200px">
                <Stack align="center" gap="xs">
                  <IconRobot size={48} color="#adb5bd" />
                  <Text c="dimmed">Задайте вопрос помощнику</Text>
                </Stack>
              </Center>
            ) : (
              chatHistory.map((msg, idx) => (
                <Box 
                  key={idx} 
                  p="md" 
                  bg={msg.role === 'user' ? 'blue.0' : 'gray.0'}
                  style={{ 
                    borderRadius: '8px',
                    marginLeft: msg.role === 'user' ? '20%' : 0,
                    marginRight: msg.role === 'assistant' ? '20%' : 0,
                  }}
                >
                  {msg.role === 'user' ? (
                    <Text>{msg.content}</Text>
                  ) : (
                    <Stack gap="xs">
                      {msg.answer && <Text>{msg.answer}</Text>}
                      
                      {msg.table && msg.table.columns && (
                        <Table striped fontSize="sm" mt="md">
                          <Table.Thead>
                            <Table.Tr>
                              {msg.table.columns.map((col, i) => (
                                <Table.Th key={i}>{col}</Table.Th>
                              ))}
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {msg.table.rows?.map((row, i) => (
                              <Table.Tr key={i}>
                                {msg.table.columns.map((col, j) => (
                                  <Table.Td key={j}>{row[col]}</Table.Td>
                                ))}
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      )}
                      
                      {msg.calculation && (
                        <Box mt="md" p="sm" bg="white" style={{ borderRadius: '4px' }}>
                          <Text size="xs" fw={700} c="dimmed">Расчёт:</Text>
                          <Text size="sm">{msg.calculation}</Text>
                        </Box>
                      )}
                      
                      {msg.explanation && (
                        <Box mt="md" p="sm" bg="white" style={{ borderRadius: '4px' }}>
                          <Text size="xs" fw={700} c="dimmed">Объяснение:</Text>
                          <Text size="sm">{msg.explanation}</Text>
                        </Box>
                      )}
                      
                      {msg.warnings && msg.warnings.length > 0 && (
                        <Stack gap="xs" mt="md">
                          {msg.warnings.map((warning, i) => (
                            <Badge key={i} color="orange" variant="light">
                              ⚠️ {warning}
                            </Badge>
                          ))}
                        </Stack>
                      )}
                      
                      {msg.follow_up && msg.follow_up.length > 0 && (
                        <>
                          <Divider my="xs" />
                          <Text size="xs" c="dimmed">Рекомендуемые вопросы:</Text>
                          <Group gap="xs">
                            {msg.follow_up.map((question, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleExampleClick(question)}
                              >
                                {question}
                              </Badge>
                            ))}
                          </Group>
                        </>
                      )}
                    </Stack>
                  )}
                </Box>
              ))
            )}
            
            {chatMutation.isPending && (
              <Box p="md" bg="gray.0" style={{ borderRadius: '8px' }}>
                <Group gap="xs">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">Помощник думает...</Text>
                </Group>
              </Box>
            )}
          </Stack>
        </ScrollArea>
      </Card>

      {/* Input */}
      <Card p="md" withBorder>
        <Group gap="md">
          <TextInput
            placeholder="Задайте вопрос..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={chatMutation.isPending}
            style={{ flex: 1 }}
            leftSection={<IconMessageChatbot size={18} />}
          />
          <Button 
            onClick={handleSend} 
            loading={chatMutation.isPending}
            disabled={!message.trim()}
            leftSection={<IconSend size={18} />}
          >
            Отправить
          </Button>
        </Group>
      </Card>
    </Stack>
  );
};
