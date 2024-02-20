import Price from './price';
import Capacity from './capacity';
import Category from './category';
import RadioBtn from './radio';
import Tag from './tag';
import { Box, Grid } from '@mui/material';

type Category = {
  category_course: string;
};

type Tag = {
  id_tag: number;
  name_tag: string;
};

type Props = {
  category: string;
  setCategory: (value: string) => void;
  selectedTags: Tag[];
  setSelectedTags: (value: Tag[]) => void;
  isMobile: boolean;
};

export default function DetailList(props: Props) {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        rowSpacing={{ sm: 2, md: 3 }}
        columnSpacing={{ md: 2 }}
        sx={{ width: '100%' }}
      >
        <Grid item sm={12} md={6}>
          <Price />
        </Grid>
        <Grid item sm={12} md={6}>
          <Capacity />
        </Grid>
        <Grid item sm={12} md={12}>
          <RadioBtn />
        </Grid>
        <Grid item sm={12} md={6}>
          <Category category={props.category} setCategory={props.setCategory} />
        </Grid>
        <Grid item sm={12} md={6}>
          <Tag
            selectedTags={props.selectedTags}
            setSelectedTags={props.setSelectedTags}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
