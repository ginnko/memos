
### 基本概念

### 待处理

1. Nest IoC container (https://docs.nestjs.com/fundamentals/custom-providers)

> Finally, we register the provider with the Nest IoC container

2. 在module中使用自定义provider后，比如useValue，在controller中拿到的是userValue的值？

3. 在一个module中导入provider，然后在导出，说是可以在其他module中使用，为啥不直接在其他module中再次导入？

>The ConfigModule registers a ConfigService and exports it for visibility in other consuming modules.(https://docs.nestjs.com/techniques/configuration)

### 参考资料

| 序号 | 标题                                                         | 备注                                   |
| ---- | ------------------------------------------------------------ | -------------------------------------- |
| 1    | [中文资料汇总](https://docs.nestjs.cn/)                      | 包含中文文档和相关项目链接             |
| 2    | [官方文档](https://docs.nestjs.com/)                         | 英文，感觉有些部分比中文文档讲的详细些 |
| 3    | [使用Nest实现CNode社区](https://github.com/jiayisheji/blog/issues/19) | 实战                                   |
| 4    | [Nestjs开发博客api](https://www.bilibili.com/video/av66475543) | 简单实战，但是最开始接触还是挺震撼的   |
| 5    | [ioC](https://juejin.im/post/5ca40fa5f265da309e173e62)       | Inversion of Control的解释             |



