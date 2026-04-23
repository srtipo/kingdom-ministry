import { Button } from '@/ui/buttons/ui-button';
import { Card } from '@/ui/cards/card';
import { Icon } from '@/ui/icons/icon';
import { Text } from '@/ui/texts/text';
import { View } from 'react-native';
export function NoVisitCard() {
  return (
    <Card
      type={'contained'}
      display={'flex'}
      flexDirection={'column'}
      itemsCenter
      border={'dashed'}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          padding: 20,
        }}>
        <Icon type={'account-multiple'} size={40} />
        <Text>No tienes revisitas registradas</Text>
        <Button type={'contained'} icon={'plus'}>
          Nueva Revisita/Curso
        </Button>
      </View>
    </Card>
  );
}
