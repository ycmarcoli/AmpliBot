export default function handleExport(messages: Message[] | undefined) {
  if (!messages) return;

  const formattedMessages: FormattedMessage[] = messages.map((message) => ({
    role: message.isBot ? 'assistant' : 'user',
    content: message.text,
  }));

  const dataStr = JSON.stringify(formattedMessages, null, 2);
  const dataUri =
    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = 'messages.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
